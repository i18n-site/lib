export default async ({ DELETE, GET, POST }, host) => {
  const zone_id = (await GET("zones?name=" + host))[0].id,
    getName = (name) => (name ? name + "." + host : host),
    prefix = `zones/${zone_id}/`,
    set = async (type, name, content, proxied) => {
      return (
        await POST(prefix + "dns_records", {
          type,
          name: getName(name),
          content,
          proxied: !!proxied,
        })
      ).id;
    };
  return {
    set: async (type, name, content, proxied = false) => {
      let n = 0;
      for (;;) {
        try {
          return await set(type, name, content, proxied);
        } catch (e) {
          if (++n > 1 || !e.message?.includes("already exists")) {
            throw e;
          }
        }
      }
    },
    rm: (type, name) => DELETE(prefix),
  };
};
