#!/usr/bin/env bun

import { Config } from "@alicloud/openapi-client";
import Cas, {
  CreateUserCertificateRequest,
  DescribeUserCertificateListRequest,
} from "@alicloud/cas20180713";
import Cdn, {
  SetCdnDomainSSLCertificateRequest,
  DescribeUserDomainsRequest,
} from "@alicloud/cdn20180510";
import Esa, {
  SetCertificateRequest,
  ListSitesRequest,
} from "@alicloud/esa20240910";
import pageiter from "@3-/pageiter";
import Cert from "@3-/cert";

const REGION = "cn-hangzhou",
  CAS = "cas";

const match = (host_li, target) => {
  for (const d of host_li) {
    if (d === target || (d[0] === "*" && target.endsWith(d.slice(1))))
      return true;
  }
  return false;
};

const upload = async (cas, name, key, crt) => {
  try {
    return (
      await cas.createUserCertificate(
        new CreateUserCertificateRequest({ name, key, cert: crt }),
      )
    ).body.certId;
  } catch (e) {
    if (e.code !== "NameRepeat") throw e;
    const r = await cas.describeUserCertificateList(
      new DescribeUserCertificateListRequest({ showSize: 100, currentPage: 1 }),
    );
    for (const c of r.body.certificateList) if (c.name === name) return c.id;
    throw new Error(`cert ${name} not found`);
  }
};

const toHex = (buf) =>
  [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");

const hmac = async (key, data) => {
  const k = typeof key === "string" ? new TextEncoder().encode(key) : key;
  return new Uint8Array(
    await crypto.subtle.sign(
      "HMAC",
      await crypto.subtle.importKey(
        "raw",
        k,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"],
      ),
      new TextEncoder().encode(data),
    ),
  );
};

const sha256 = async (str) =>
  toHex(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str)),
    ),
  );

const ossSign = async (id, secret, bucket, endpoint, date, hash) => {
  const region = endpoint.split(".")[0].replace("oss-", ""),
    scope = `${date.slice(0, 8)}/${region}/oss/aliyun_v4_request`,
    canonical = `POST\n/\ncname=&comp=add\nhost:${bucket}.${endpoint}\nx-oss-content-sha256:${hash}\nx-oss-date:${date}\n\nhost;x-oss-content-sha256;x-oss-date\n${hash}`;
  let key = await hmac(`aliyun_v4${secret}`, date.slice(0, 8));
  for (const s of [region, "oss", "aliyun_v4_request"])
    key = await hmac(key, s);
  return `OSS4-HMAC-SHA256 Credential=${id}/${scope},AdditionalHeaders=host,Signature=${toHex(await hmac(key, `OSS4-HMAC-SHA256\n${date}\n${scope}\n${await sha256(canonical)}`))}`;
};

const bindOss = async (id, secret, bucket, domain, endpoint, crt, key) => {
  const body = `<?xml version="1.0" encoding="UTF-8"?><BucketCnameConfiguration><Cname><Domain>${domain}</Domain><CertificateConfiguration><Certificate>${crt}</Certificate><PrivateKey>${key}</PrivateKey><Force>true</Force></CertificateConfiguration></Cname></BucketCnameConfiguration>`,
    date = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""),
    hash = await sha256(body),
    r = await fetch(`https://${bucket}.${endpoint}/?cname&comp=add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/xml",
        "x-oss-date": date,
        "x-oss-content-sha256": hash,
        Authorization: await ossSign(id, secret, bucket, endpoint, date, hash),
      },
      body,
    });
  if (!r.ok) throw new Error(await r.text());
};

const wrap = (type, id, fn) =>
  fn()
    .then(() => console.log(`bindded ${type} ${id}`))
    .catch((e) => {
      throw new Error(`[${type}] ${id}: ${e.message || e}`);
    });

export default ([id, secret]) => {
  const conf = (endpoint) =>
      new Config({ accessKeyId: id, accessKeySecret: secret, endpoint }),
    cas = new Cas(conf("cas.aliyuncs.com")),
    cdn = new Cdn(conf("cdn.aliyuncs.com")),
    esa = new Esa(conf("esa.cn-hangzhou.aliyuncs.com"));

  const listCdn = async () => {
    const li = [];
    for await (const d of pageiter((p) =>
      cdn
        .describeUserDomains(
          new DescribeUserDomainsRequest({ pageNumber: p, pageSize: 500 }),
        )
        .then((r) => r.body.host_li?.pageData),
    ))
      li.push(d.domainName);
    return li;
  };

  const listEsa = async () => {
    const li = [];
    for await (const s of pageiter((p) =>
      esa
        .listSites(new ListSitesRequest({ pageNumber: p, pageSize: 500 }))
        .then((r) => r.body.sites),
    ))
      li.push([s.siteId, s.siteName]);
    return li;
  };

  const bindCdn = (domain, cert_id) =>
    cdn.setCdnDomainSSLCertificate(
      new SetCdnDomainSSLCertificateRequest({
        domainName: domain,
        SSLProtocol: "on",
        certType: CAS,
        certId: cert_id,
        certRegion: REGION,
      }),
    );

  const bindEsa = (site_id, cert_id) =>
    esa
      .setCertificate(
        new SetCertificateRequest({
          siteId: site_id,
          type: CAS,
          casId: cert_id,
          region: REGION,
        }),
      )
      .catch((e) => {
        if (e.code !== "Certificate.Duplicated") throw e;
      });

  return async ([key, crt], opt) => {
    const { expire, host_li, host } = Cert(crt),
      cert_id = await upload(cas, `${host}-${expire}`, key, crt),
      tasks = [];

    console.log(`cert uploaded: ${host_li.join(" ")}`);

    if (opt?.oss) {
      for (const [bucket, domain, endpoint] of opt.oss) {
        if (match(host_li, domain))
          tasks.push(
            wrap("oss", `${bucket}/${domain}`, () =>
              bindOss(id, secret, bucket, domain, endpoint, crt, key),
            ),
          );
      }
    }

    const [cdn_li, esa_li] = await Promise.all([listCdn(), listEsa()]);

    for (const d of cdn_li)
      if (match(host_li, d))
        tasks.push(wrap("cdn", d, () => bindCdn(d, cert_id)));
    for (const [sid, name] of esa_li)
      if (match(host_li, name))
        tasks.push(wrap("esa", name, () => bindEsa(sid, cert_id)));

    const errors = (await Promise.allSettled(tasks))
      .filter((r) => r.status === "rejected")
      .map((r) => r.reason.message);
    if (errors.length) throw new Error(errors.join("\n"));

    return cert_id;
  };
};
