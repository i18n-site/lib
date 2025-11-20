import { Client, crypto } from "acme-client";

const ACME_CHALLENGE = "_acme-challenge";


export default async (kid, hmacKey)=>
  (domain, setTxt, rmTxt) => {
  const email = "ssl@" + domain,
    client = new Client({
      directoryUrl: "https://acme.zerossl.com/v2/DV90",
      accountKey: await crypto.createPrivateKey(),
      externalAccountBinding: {
        kid,
        hamacKey,
      }
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
  return [
    cert_key.toString(),
    await client.auto({
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
    }),
  ];
};
