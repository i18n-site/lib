export default async ({ GET }, host) => {
  const zone_id = (await GET("zones?name=" + host))[0].id;
};
