export default async ({ GET }, host) => {
  console.log(await GET("zones?name=" + host));
};
