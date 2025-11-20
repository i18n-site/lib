import { Client, crypto } from "acme-client";
import sleep from "@3-/sleep";

export default async (domain, setTxt, rmTxtById) => {
  const domain_li = ["*." + domain, domain],
    challenge = await "TODO",
    cname_id = await setTxt("xxx." + domain, challenge);

  try {
    await sleep(6e3);
    const [key, cert] = "TODO";
    return [key, cert];
  } finally {
    await rmTxtById(cname_id);
  }
};
