import { Client, forge } from "acme-client";
import { generateKeyPair } from "crypto";
import { promisify } from "util";
import sleep from "@3-/sleep";

const _dir = import.meta.dirname;
const generate_key_pair = promisify(generateKeyPair);

const 生成密钥 = async () => {
  const { privateKey } = await generate_key_pair("ec", {
    namedCurve: "P-384",
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return privateKey;
};

const 生成请求 = async (key_pem, domains) => {
  const private_key = forge.pki.privateKeyFromPem(key_pem);
  const [common_name, ...alt_names] = domains;
  const [_, csr] = await forge.createCsr({
    key: private_key,
    commonName: common_name,
    altNames: alt_names,
  });
  return csr;
};

const 获取eab = async (email) => {
  const res = await fetch('https://api.zerossl.com/acme/eab-credentials-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ email }),
  });
  const { eab_kid, eab_hmac_key } = await res.json();
  return { kid: eab_kid, hmacKey: eab_hmac_key };
};

export default async (host, set_cname, rm_by_id) => {
  const email = 'i18n.site@gmail.com';
  const account_key = await 生成密钥();
  const client = new Client({
    directoryUrl: 'https://acme.zerossl.com/v2/DV90',
    accountKey: account_key,
  });

  const { kid, hmacKey } = await 获取eab(email);
  const external_account_binding = await client.createAccountKeyBinding(kid, hmacKey);

  await client.createAccount({
    termsOfServiceAgreed: true,
    contact: [`mailto:${email}`],
    externalAccountBinding: external_account_binding,
  });

  const certificate_key = await 生成密钥();
  const domains = [host, `*.${host}`];
  const csr = await 生成请求(certificate_key, domains);

  const challenge_ids = new Map();

  const create_challenge = async (authz, challenge, key_authorization) => {
    if (challenge.type === 'dns-01') {
      const id = await set_cname(key_authorization);
      challenge_ids.set(challenge.token, id);
      await sleep(10000);
    }
  };

  const remove_challenge = async (authz, challenge) => {
    const id = challenge_ids.get(challenge.token);
    if (id) {
      await rm_by_id(id);
      challenge_ids.delete(challenge.token);
    }
  };

  const certificate = await client.auto({
    csr,
    email,
    termsOfServiceAgreed: true,
    challengePriority: ['dns-01'],
    challengeCreateFn: create_challenge,
    challengeRemoveFn: remove_challenge,
  });

  return [certificate_key, certificate];
};
