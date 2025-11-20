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
    rmById = async (id) => DELETE(dns_records + "/" + id),
    rmByName = async (type, name) => rmById(await idByName(type, name)),
    ls = async function* () {
      let page = 1;
      const r = await GET(dns_records + "?page=" + page);
      console.log(r);
      yield* r;
    };

  return {
    ls,
    rmById,
    rmByName,
    set: async (type, name, content, proxied = false) => {
      const _set = () => set(type, name, content, proxied);
      try {
        return await _set();
      } catch (e) {
        if (!e.message?.includes(" already exists")) {
          throw e;
        }
        await rmByName(type, name);
        return _set();
      }
    },
  };
};
