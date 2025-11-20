import sleep from "@3-/sleep";

export default async (
  host,
  setCname, // prefix value
  rmById,
) => {
  const cname = await xxx(host);

  const id = await setCname(cname),
    waited = 0;
  try {
    while (waited < 120) {
      // 等待cname生效
      await sleep(1e3);
    }
    return [key, crt];
  } finally {
    await rmById(id);
  }
};
