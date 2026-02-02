import doh from "@3-/doh/AnswerData.js";
import tlsSmtp from "@3-/tls_smtp";

export default async (domain, user, password) =>
  (
    await Promise.allSettled(
      ["A", "AAAA"].map(async (type) =>
        Promise.allSettled(
          (await doh(domain, type)).map(async (ip) => {
            console.log(domain, type, ip);
            try {
              return await tlsSmtp(user, password, ip, domain);
            } catch (err) {
              console.error(err);
              throw [domain, ip, err];
            }
          }),
        ),
      ),
    )
  ).flatMap((i) => i.value);
