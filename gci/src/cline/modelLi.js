import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { mkdir, writeFile, readFile } from "node:fs/promises";
import reqJson from "@3-/req/reqJson.js";

const CACHE_DIR =
    process.env.XDG_CACHE_HOME ||
    (process.platform === "darwin"
      ? join(homedir(), "Library", "Caches")
      : join(homedir(), ".cache")),
  CACHE_FILE = join(CACHE_DIR, "gci/cline_models.json"),
  DAY_SEC = 86400,
  cacheRead = async () => {
    if (typeof Bun !== "undefined") {
      const file = Bun.file(CACHE_FILE);
      return (await file.exists()) ? await file.json() : null;
    }
    const text = await readFile(CACHE_FILE, "utf8").catch(() => null);
    return text ? JSON.parse(text) : null;
  },
  cacheWrite = async (li) => {
    const data = JSON.stringify({
      ts: Math.round(Date.now() / 1000),
      li,
    });
    await mkdir(dirname(CACHE_FILE), { recursive: true }).catch(() => null);
    if (typeof Bun !== "undefined") {
      await Bun.write(CACHE_FILE, data);
    } else {
      await writeFile(CACHE_FILE, data).catch(() => null);
    }
  },
  modelFetch = async () => {
    const data = await reqJson(
        "https://api.cline.bot/api/v1/ai/cline/recommended-models",
      ),
      li = data.free.map((item) => item.id);
    cacheWrite(li);
    return li;
  };

export default async () => {
  const cache = await cacheRead(),
    now = Math.round(Date.now() / 1000);

  if (cache?.li?.length) {
    if (now - cache.ts > DAY_SEC) {
      modelFetch().catch(() => null);
    }
    return cache.li;
  }

  return await modelFetch();
};
