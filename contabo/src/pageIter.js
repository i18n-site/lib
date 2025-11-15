import iter from "./iter.js";

export default async function* (api, url, params = {}) {
  for await (const i of iter((page) =>
    api(
      url +
        "?" +
        new URLSearchParams({
          ...params,
          page,
        }).toString(),
    ),
  )) {
    yield i;
  }
}
