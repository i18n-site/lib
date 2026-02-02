import cJson from "@8v/curl/cJson.js";

export default (key, mail) => {
  return new Proxy(
    {},
    {
      get: (_, method) => {
        return async (suffix, body) => {
          const data = {
            method,
            headers: {
              "X-Auth-Key": key,
              "X-Auth-Email": mail,
              "Content-Type": "application/json",
            },
          };
          if (body) {
            data.body = JSON.stringify(body);
          }
          const r = await cJson(
            "https://api.cloudflare.com/client/v4/" + suffix,
            data,
          );
          if (r.success) {
            return r.result;
          }
          throw new Error(JSON.stringify(r, null, 2));
        };
      },
    },
  );
};
