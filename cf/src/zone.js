import debug from "@3-/console/debug.js";

export default async ({ DELETE, GET, POST }, host) => {
  const zone_id = (await GET("zones?name=" + host))[0].id,
    getName = (name) => (name ? name + "." + host : host),
    prefix = `zones/${zone_id}/`,
    dns_records = prefix + "dns_records",
    set = async (type, name, content, proxied) => {
      return (
        await POST(dns_records, {
          type,
          name: getName(name),
          content,
          proxied: !!proxied,
        })
      ).id;
    },
    idByName = async (type, name) =>
      (await GET(dns_records + `?name=${getName(name)}&type=${type}`))[0].id,
    rmByName = async (type, name) =>
      DELETE(dns_records + "/" + (await idByName(type, name)));
  return {
    set: async (type, name, content, proxied = false) => {
      let n = 0;
      for (;;) {
        try {
          return await set(type, name, content, proxied);
        } catch (e) {
          if (++n > 1 || !e.message?.includes(" already exists")) {
            throw e;
          }
          console.log(await rmByName(type, name));
        }
      }
    },
  };
};
