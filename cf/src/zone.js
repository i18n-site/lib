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
      try {
        return await set(type, name, content, proxied);
      } catch (e) {
        console.log(e);
      }
    },
    rm: (type, name) => DELETE(prefix),
  };
};
