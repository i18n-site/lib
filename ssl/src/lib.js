import { Client, crypto } from "acme-client";

export default async (domain, setTxt, rmTxt) => {
  const email = "ssl@" + domain,
    client = new Client({
      directoryUrl: "https://acme-v02.api.letsencrypt.org/directory",
      accountKey: await crypto.createPrivateKey(),
    });

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
      console.log({ authz, challenge, key_auth });
      await setTxt("_acme-challenge", '"' + key_auth + '"');
    },
    challengeRemoveFn: async (authz, challenge, key_auth) => {
      await rmTxt("_acme-challenge");
    },
  });

  return [cert_key, cert];
};
