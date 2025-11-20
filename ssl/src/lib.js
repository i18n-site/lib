import { Client, crypto } from "acme-client";

const 创建客户端 = async (email) => {
  const account_key = await crypto.createPrivateKey();
  return new Client({
    directoryUrl: "https://acme-v02.api.letsencrypt.org/directory",
    accountKey: account_key,
  });
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

export default async (domain, setTxt, rmTxt) => {
  const email = "ssl@" + domain,
    client = await 创建客户端(email),

  const [cert_key, csr] = await crypto.createCsr({
    commonName: domain,
    altNames: ["*." + domain, domain],
  });

  const cert = await client.auto({
    csr,
    email,
    termsOfServiceAgreed: true,
    challengePriority: ["dns-01"],
    challengeCreateFn: async (authz, challenge, key_auth) => {
      console.log({ authz, challenge key_auth});
      await setTxt("_acme-challenge", '"' + key_auth + '"');
    },
    challengeRemoveFn: async (authz, challenge, key_auth) => {
      await rmTxt("_acme-challenge");
    },
  });

  return [cert_key, cert];
};
