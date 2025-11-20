import { Client, crypto } from "acme-client";

const ACME_CHALLENGE = "_acme-challenge";

export default async (domain, setTxt, rmTxt) => {
  const email = "ssl@" + domain,
    client = new Client({
      directoryUrl: "https://acme-v02.api.letsencrypt.org/directory",
      accountKey: await crypto.createPrivateKey(),
    });

  const [cert_key, csr] = await crypto.createCsr({
    commonName: domain,
    altNames: [domain, "*." + domain],
  });

  const cert = await client.auto({
    csr,
    email,
    termsOfServiceAgreed: true,
    challengePriority: ["dns-01"],
    challengeCreateFn: async (_authz, _challenge, key_auth) => {
      await setTxt(ACME_CHALLENGE, key_auth);
    },
    challengeRemoveFn: async () => {
      await rmTxt(ACME_CHALLENGE);
    },
  });

  return [cert_key, cert];
};
