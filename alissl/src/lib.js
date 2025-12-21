#!/usr/bin/env bun

import { X509Certificate } from "crypto";
import { Config } from "@alicloud/openapi-client";
import Cas, { CreateUserCertificateRequest, DescribeUserCertificateListRequest } from "@alicloud/cas20180713";
import Cdn, { SetCdnDomainSSLCertificateRequest, DescribeUserDomainsRequest } from "@alicloud/cdn20180510";
import Esa, { SetCertificateRequest, ListSitesRequest } from "@alicloud/esa20240910";
import pageiter from "@3-/pageiter";

const REGION = "cn-hangzhou";

const certInfo = (crt) => {
  const x509 = new X509Certificate(crt),
    date = new Date(x509.validTo),
    y = date.getFullYear(),
    m = String(date.getMonth() + 1).padStart(2, "0"),
    d = String(date.getDate()).padStart(2, "0"),
    expire = `${y}${m}${d}`,
    san = x509.subjectAltName || "",
    domains = san.split(",").map((s) => s.trim().replace(/^DNS:/, "")).filter(Boolean),
    shortest = domains.reduce((a, b) => a.length <= b.length ? a : b, domains[0] || "");
  return { expire, domains, shortest };
};

const matchDomain = (domains, target) => {
  for (const d of domains) {
    if (d === target) return true;
    if (d.startsWith("*.") && target.endsWith(d.slice(1))) return true;
  }
  return false;
};

const uploadCert = async (cas, name, key, crt) => {
  const req = new CreateUserCertificateRequest({ name, key, cert: crt });
  try {
    const r = await cas.createUserCertificate(req);
    return r.body.certId;
  } catch (e) {
    if (e.code !== "NameRepeat") throw e;
    const list_req = new DescribeUserCertificateListRequest({ showSize: 100, currentPage: 1 }),
      r = await cas.describeUserCertificateList(list_req);
    for (const cert of r.body.certificateList) {
      if (cert.name === name) return cert.id;
    }
    throw new Error(`cert ${name} not found after NameRepeat`);
  }
};

const listCdnDomains = async (cdn) => {
  const domains = [];
  for await (const d of pageiter((page) => cdn.describeUserDomains(new DescribeUserDomainsRequest({ pageNumber: page, pageSize: 500 })).then((r) => r.body.domains?.pageData))) {
    domains.push(d.domainName);
  }
  return domains;
};

const listEsaSites = async (esa) => {
  const sites = [];
  for await (const s of pageiter((page) => esa.listSites(new ListSitesRequest({ pageNumber: page, pageSize: 500 })).then((r) => r.body.sites))) {
    sites.push({ id: s.siteId, name: s.siteName });
  }
  return sites;
};

const bindCdn = async (cdn, domain, cert_id) => {
  await cdn.setCdnDomainSSLCertificate(new SetCdnDomainSSLCertificateRequest({
    domainName: domain,
    SSLProtocol: "on",
    certType: "cas",
    certId: cert_id,
    certRegion: REGION,
  }));
  console.log(`bindded cdn ${domain}`);
};

const bindEsa = async (esa, site_id, site_name, cert_id) => {
  try {
    await esa.setCertificate(new SetCertificateRequest({
      siteId: site_id,
      type: "cas",
      casId: cert_id,
      region: REGION,
    }));
  } catch (e) {
    if (e.code !== "Certificate.Duplicated") throw e;
  }
  console.log(`bindded esa ${site_name}`);
};

const hmacSha256 = async (key, data) => {
  const k = typeof key === "string" ? new TextEncoder().encode(key) : key,
    cryptoKey = await crypto.subtle.importKey("raw", k, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]),
    sig = await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(data));
  return new Uint8Array(sig);
};

const toHex = (buf) => [...buf].map((b) => b.toString(16).padStart(2, "0")).join("");

const sha256Hex = async (str) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return toHex(new Uint8Array(buf));
};

const ossSign = async (accessKeyId, accessKeySecret, method, bucket, endpoint, date, body_hash) => {
  const region = endpoint.split(".")[0].replace("oss-", ""),
    scope = `${date.slice(0, 8)}/${region}/oss/aliyun_v4_request`,
    canonical = `${method}\n/\ncname=&comp=add\nhost:${bucket}.${endpoint}\nx-oss-content-sha256:${body_hash}\nx-oss-date:${date}\n\nhost;x-oss-content-sha256;x-oss-date\n${body_hash}`,
    canonical_hash = await sha256Hex(canonical),
    str_to_sign = `OSS4-HMAC-SHA256\n${date}\n${scope}\n${canonical_hash}`;

  let key = await hmacSha256(`aliyun_v4${accessKeySecret}`, date.slice(0, 8));
  key = await hmacSha256(key, region);
  key = await hmacSha256(key, "oss");
  key = await hmacSha256(key, "aliyun_v4_request");
  return `OSS4-HMAC-SHA256 Credential=${accessKeyId}/${scope},AdditionalHeaders=host,Signature=${toHex(await hmacSha256(key, str_to_sign))}`;
};

const bindOss = async (accessKeyId, accessKeySecret, bucket, domain, endpoint, crt, key) => {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<BucketCnameConfiguration>
  <Cname>
    <Domain>${domain}</Domain>
    <CertificateConfiguration>
      <Certificate>${crt}</Certificate>
      <PrivateKey>${key}</PrivateKey>
      <Force>true</Force>
    </CertificateConfiguration>
  </Cname>
</BucketCnameConfiguration>`,
    date = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""),
    body_hash = await sha256Hex(body),
    auth = await ossSign(accessKeyId, accessKeySecret, "POST", bucket, endpoint, date, body_hash),
    url = `https://${bucket}.${endpoint}/?cname&comp=add`;

  const r = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/xml", "x-oss-date": date, "x-oss-content-sha256": body_hash, Authorization: auth },
    body,
  });
  if (!r.ok) throw new Error(await r.text());
  console.log(`oss bindded: ${bucket}/${domain}`);
};

const wrap = (type, id, fn) =>
  fn().catch((e) => { throw new Error(`[${type}] ${id}: ${e.message || e}`); });

export default ([accessKeyId, accessKeySecret]) => {
  const conf = (endpoint) => new Config({ accessKeyId, accessKeySecret, endpoint }),
    cas = new Cas(conf("cas.aliyuncs.com")),
    cdn = new Cdn(conf("cdn.aliyuncs.com")),
    esa = new Esa(conf("esa.cn-hangzhou.aliyuncs.com"));

  return async (host, key, crt, opt) => {
    const { expire, domains } = certInfo(crt),
      name = `${host}-${expire}`,
      cert_id = await uploadCert(cas, name, key, crt);

    console.log(`cert uploaded: ${name} (id: ${cert_id}) domains: ${domains.join(", ")}`);

    const tasks = [];

    if (opt?.oss) {
      for (const [bucket, domain, endpoint] of opt.oss) {
        if (matchDomain(domains, domain)) {
          tasks.push(wrap("oss", `${bucket}/${domain}`, () => bindOss(accessKeyId, accessKeySecret, bucket, domain, endpoint, crt, key)));
        }
      }
    }

    const [cdn_domains, esa_sites] = await Promise.all([listCdnDomains(cdn), listEsaSites(esa)]);

    for (const d of cdn_domains) {
      if (matchDomain(domains, d)) {
        tasks.push(wrap("cdn", d, () => bindCdn(cdn, d, cert_id)));
      }
    }

    for (const s of esa_sites) {
      if (matchDomain(domains, s.name)) {
        tasks.push(wrap("esa", s.name, () => bindEsa(esa, s.id, cert_id)));
      }
    }

    const results = await Promise.allSettled(tasks),
      errors = results.filter((r) => r.status === "rejected").map((r) => r.reason.message);

    if (errors.length) throw new Error(errors.join("\n"));

    return cert_id;
  };
};
