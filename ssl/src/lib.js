import { Client, crypto } from "acme-client";
import sleep from "@3-/sleep";

const ACME_CHALLENGE = "_acme-challenge";

export default async (domain, setTxt, rmTxt) => {
  const email = "ssl@" + domain,
    client = new Client({
      directoryUrl: "https://acme-v02.api.letsencrypt.org/directory",
      accountKey: await crypto.createPrivateKey(),
    }),
    [cert_key, csr] = await crypto.createCsr({
      commonName: domain,
      altNames: [domain, "*." + domain],
    });

  /*
  返回 [证书私钥, 证书内容]

  nginx 配置:
    ssl_certificate_key 使用第一个 (证书私钥)
    ssl_certificate 使用第二个 (证书内容)

  cert_key 转换: cert_key.toString() 即可得到 nginx 需要的 PEM 格式
  */
  try {
    return [
      cert_key.toString(),
      await client.auto({
        csr,
        email,
        skipChallengeVerification: true,
        termsOfServiceAgreed: true,
        challengePriority: ["dns-01"],
        challengeCreateFn: async (_authz, _challenge, key_auth) => {
          await setTxt(ACME_CHALLENGE, key_auth);
          await sleep(1e3);
        },
        challengeRemoveFn: async () => {},
      }),
    ];
  } finally {
    await rmTxt(ACME_CHALLENGE);
  }
};
