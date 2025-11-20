import { Client, crypto as acme_crypto } from 'acme-client';
import { generateKeyPair, createPublicKey, createHmac } from 'crypto';
import { promisify } from 'util';
import sleep from '@3-/sleep';

const _dir = import.meta.dirname;
const generate_key_pair = promisify(generateKeyPair);

const url_b64 = (str) => Buffer.from(str).toString('base64url');
const json_b64 = (obj) => url_b64(JSON.stringify(obj));

const 生成密钥 = async () => {
  const { privateKey } = await generate_key_pair('ec', {
    namedCurve: 'P-384',
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return privateKey;
};

const 生成请求 = async (key_pem, domains) => {
  const [common_name, ...alt_names] = domains;
  const [_, csr] = await acme_crypto.createCsr({
    key: key_pem,
    commonName: common_name,
    altNames: alt_names,
  });
  return csr;
};

const 获取eab = async (email) => {
  const res = await fetch(
    "https://api.zerossl.com/acme/eab-credentials-email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ email }),
    },
  );
  const { eab_kid, eab_hmac_key } = await res.json();
  return { kid: eab_kid, hmacKey: eab_hmac_key };
};

const 生成eab_jws = (account_key_pem, kid, hmac_key_b64, new_account_url) => {
  const public_key = createPublicKey(account_key_pem);
  const public_jwk = public_key.export({ format: 'jwk' });

  const mac_key = Buffer.from(hmac_key_b64, 'base64url');

  const protected_header = {
    alg: 'HS256',
    kid: kid,
    url: new_account_url
  };

  const payload = JSON.stringify(public_jwk);
  const payload_b64 = url_b64(payload);
  const protected_b64 = json_b64(protected_header);

  const data_to_sign = `${protected_b64}.${payload_b64}`;
  const signature = createHmac('sha256', mac_key).update(data_to_sign).digest('base64url');

  return {
    protected: protected_b64,
    payload: payload_b64,
    signature: signature
  };
};

export default async (host, set_cname, rm_by_id) => {
  const email = "i18n.site@gmail.com";
  const account_key = await 生成密钥();
  const directory_url = 'https://acme.zerossl.com/v2/DV90';

  const client = new Client({
    directoryUrl: directory_url,
    accountKey: account_key,
  });

  // Fetch directory to get newAccount URL
  const directory_res = await fetch(directory_url);
  const directory = await directory_res.json();
  const new_account_url = directory.newAccount;

  const { kid, hmacKey } = await 获取eab(email);
  const external_account_binding = 生成eab_jws(account_key, kid, hmacKey, new_account_url);

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
    if (challenge.type === "dns-01") {
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

  console.log('CSR:', csr.toString());
  const certificate = await client.auto({
    csr,
    identifiers: domains.map(d => ({ type: 'dns', value: d })),
    email,
    termsOfServiceAgreed: true,
    challengePriority: ['dns-01'],
    challengeCreateFn: create_challenge,
    challengeRemoveFn: remove_challenge,
  });

  return [certificate_key, certificate];
};

