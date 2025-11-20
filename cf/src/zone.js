export default async ({ GET, POST }, host) => {
  const zone_id = (await GET("zones?name=" + host))[0].id;
  return {
    set: (type, name, content, proxied) =>
      POST(`zones/${zone_id}/dns_records`, {
        type,
        name: name == "@" ? name : name + "." + host,
        content,
        proxied: !!proxied,
      }),
    rm: () => {},
  };
};
