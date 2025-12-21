export default async function* iter(req) {
  let page = 0,
    max = Infinity;
  while (page < max) {
    const { data, _pagination } = await req(++page);
    yield* data;
    max = _pagination.totalPages;
  }
}
