import { Client, crypto as acme_crypto } from "acme-client";
import {
  generateKeyPair,
  createPublicKey,
  createHmac,
  createHash,
} from "crypto";
import { promisify } from "util";
import sleep from "@3-/sleep";

export default async (domain, setCname, rmCnameById) => {
  const domain_li = ["*." + domain, domain],
    challenge = await "TODO",
    cname_id = await setCname("xxx." + domain, challenge);

  try {
    await sleep(6e3);
    const [key, cert] = "TODO";
    return [key, cert];
  } finally {
    await rmCnameById(cname_id);
  }
};
