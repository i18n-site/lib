import { Client, crypto } from "acme-client";
import sleep from "@3-/sleep";

const 获取EAB凭证 = async (email) => {
  const api_key = process.env.ZEROSSL_API_KEY;
  if (!api_key) {
    return null;
  }
  const url = `https://api.zerossl.com/acme/eab-credentials?access_key=${api_key}`;
  const resp = await fetch(url, { method: "POST" });
  const data = await resp.json();
  return {
    kid: data.eab_kid,
    hmacKey: data.eab_hmac_key,
  };
};

const 创建客户端 = async (email) => {
  const account_key = await crypto.createPrivateKey();
  const eab = await 获取EAB凭证(email);

  const client_options = {
    directoryUrl: "https://acme.zerossl.com/v2/DV90",
    accountKey: account_key,
  };

  if (eab) {
    client_options.externalAccountBinding = eab;
  }

  return new Client(client_options);
};

const 生成证书签名请求 = async (domain_li) => {
  const [cert_key, csr] = await crypto.createCsr({
    commonName: domain_li[domain_li.length - 1],
    altNames: domain_li,
  });
  return [cert_key, csr];
};

const 处理挑战 = async (authz, challenge, key_auth, setTxt, txt_id_map) => {
  if (challenge.type === "dns-01") {
    const dns_record = `_acme-challenge.${authz.identifier.value}`;
    const id = await setTxt(dns_record, key_auth);
    txt_id_map.set(dns_record, id);
  }
};

const 清理挑战 = async (authz, challenge, key_auth, rmTxtById, txt_id_map) => {
  if (challenge.type === "dns-01") {
    const dns_record = `_acme-challenge.${authz.identifier.value}`;
    const id = txt_id_map.get(dns_record);
    if (id) {
      await rmTxtById(id);
      txt_id_map.delete(dns_record);
    }
  }
};

export default async (domain, setTxt, rmTxtById) => {
  const domain_li = ["*." + domain, domain];
  const client = await 创建客户端();
  const txt_id_map = new Map();

  const [cert_key, csr] = await 生成证书签名请求(domain_li);

  const cert = await client.auto({
    csr,
    email: "ssl@" + domain,
    termsOfServiceAgreed: true,
    challengePriority: ["dns-01"],
    challengeCreateFn: async (authz, challenge, key_auth) => {
      await 处理挑战(authz, challenge, key_auth, setTxt, txt_id_map);
      await sleep(3e3);
    },
    challengeRemoveFn: async (authz, challenge, key_auth) => {
      await 清理挑战(authz, challenge, key_auth, rmTxtById, txt_id_map);
    },
  });

  return [cert_key, cert];
};
