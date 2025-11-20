import { Client, crypto } from "acme-client";
import sleep from "@3-/sleep";
import { set } from "lodash-es";

const 创建客户端 = async (email) => {
  const account_key = await crypto.createPrivateKey();
  return new Client({
    directoryUrl: "https://acme-v02.api.letsencrypt.org/directory",
    accountKey: account_key,
  });
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
    const id = await setTxt("_acme-challenge", '"' + key_auth + '"');
    txt_id_map.set(authz.identifier.value, id);
  }
};

const 清理挑战 = async (authz, challenge, key_auth, rmTxtById, txt_id_map) => {
  if (challenge.type === "dns-01") {
    const id = txt_id_map.get(authz.identifier.value);
    if (id) {
      await rmTxtById(id);
      txt_id_map.delete(authz.identifier.value);
    }
  }
};

export default async (domain, setTxt, rmTxtById) => {
  const domain_li = ["*." + domain, domain];
  const email = "ssl@" + domain;
  const client = await 创建客户端(email);
  const txt_id_map = new Map();

  const [cert_key, csr] = await 生成证书签名请求(domain_li);

  const cert = await client.auto({
    csr,
    email,
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
