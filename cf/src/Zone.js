export default async ({ DELETE, GET, POST }, host) => {
  const zone_id = (await GET("zones?name=" + host))[0].id,
    getName = (name) => (name ? name + "." + host : host),
    prefix = `zones/${zone_id}/`,
    dns_records = prefix + "dns_records",
    _set = async (type, name, content, ttl, proxied) => {
      const conf = {
        type,
        name: getName(name),
        content,
      };
      if (proxied) conf.proxied = true;
      if (ttl) conf.ttl = ttl;
      return (await POST(dns_records, conf)).id;
    },
    // idByName = async (type, name) =>
    //   (await GET(dns_records + `?name=${getName(name)}&type=${type}`))[0].id,
    rmById = async (id) => DELETE(dns_records + "/" + id),
    rmByName = async (name) => {
      name = getName(name);
      for await (const record of ls()) {
        if (record.name == name) {
          await rmById(record.id);
        }
      }
    },
    ls = async function* (option) {
      let page = 0;
      const per_page = 20;
      let prefix = dns_records + "?";
      if (option) {
        option = new URLSearchParams(option).toString();
        if (option) {
          prefix += option;
          prefix += "&";
        }
      }

      for (;;) {
        const li = await GET(
          prefix + "per_page=" + per_page + "&page=" + ++page,
        );
        yield* li;
        if (li.length < per_page) return;
      }
    },
    set = async (type, name, content, ttl, proxied) => {
      const _set_ = () => _set(type, name, content, ttl, proxied);
      try {
        return await _set_();
      } catch (e) {
        if (!e.message?.includes(" already exists")) {
          throw e;
        }
        await rmByName(type, name);
        return _set_();
      }
    };

  return {
    ls,
    rmById,
    rmByName,
    set,
    reset: async (prefix, to_set) => {
      const exist = new Set();
      for await (const { id, type, name, content } of ls({
        name: `${prefix}.${host}`,
      })) {
        const prefix = name.slice(0, -host.length - 1);
        if (to_set[type]?.[prefix]?.includes(content)) {
          exist.add(type + " " + prefix + " " + content);
          continue;
        }
        await rmById(id);
      }

      for (const [type, prefix_li] of Object.entries(to_set)) {
        for (const [prefix, li] of Object.entries(prefix_li)) {
          for (const content of li) {
            if (exist.has(type + " " + prefix + " " + content)) {
              continue;
            }
            try {
              await set(type, prefix, content);
            } catch (e) {
              console.error({ type, prefix, content }, e);
            }
          }
        }
      }
    },
  };
};
