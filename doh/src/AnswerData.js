export default async (doh, domain, type) => {
  const r = await doh(domain, type);
  if (r.Status) throw new Error(JSON.stringify(r, null, 2));
  return r.Answer.map(({ data }) => data);
};
