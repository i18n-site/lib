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
    rm = async (name, type) => {
      name = getName(name);
      const option = {};
      if (type) {
        option.type = type;
      }
      for await (const record of _ls(option)) {
        if (record.name == name) {
          await rmById(record.id);
        }
      }
    },
    _ls = async function* (option) {
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
        await rm(type, name);
        return _set_();
      }
    },
    ls = async (prefix, type) => {
      const option = {
        name: `${prefix}.${host}`,
      };
      if (type) {
        option.type = type;
      }
      const r = [];
      for await (const i of _ls(option)) {
        r.push(i);
      }
      return r;
    };

  return {
    ls,
    rmById,
    rm,
    set,
    reset: async (prefix, type_li) => {
      Object.entries(type_li).forEach(([k, v]) => {
        type_li[k] = new Set(v);
      });
      for (const { id, type, content } of await ls(prefix)) {
        const t = type_li[type];
        if (!t || !t.delete(content)) {
          await rmById(id);
        }
      }
      for (const [type, v] of Object.entries(type_li)) {
        for (const content of v) {
          await set(type, prefix, content);
        }
      }
    },
  };
};
