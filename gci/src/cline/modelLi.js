import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import rJson from "@3-/read/rJson.js";
import write from "@3-/write";
import reqJson from "@3-/req/reqJson.js";

const CACHE_DIR = process.env.XDG_CACHE_HOME || join(homedir(), ".cache"),
  CACHE_FILE = join(CACHE_DIR, "gci/cline_models.json"),
  DAY_SEC = 86400,
  cacheRead = () => (existsSync(CACHE_FILE) ? rJson(CACHE_FILE) : null),
  cacheWrite = (li) => {
    write(
      CACHE_FILE,
      JSON.stringify({
        ts: Math.round(Date.now() / 1000),
        li,
      }),
    );
  },
  modelSort = (li) =>
    li.sort(
      (a, b) =>
        (b.includes("deepseek") ? 1 : 0) - (a.includes("deepseek") ? 1 : 0),
    ),
  modelFetch = async () => {
    const data = await reqJson(
        "https://api.cline.bot/api/v1/ai/cline/recommended-models",
      ),
      li = modelSort(data.free.map((item) => item.id));
    cacheWrite(li);
    return li;
  };

export default async () => {
  const cache = cacheRead(),
    now = Math.round(Date.now() / 1000);

  if (cache?.li?.length) {
    if (now - cache.ts > DAY_SEC) {
      modelFetch().catch(() => null);
    }
    return modelSort(cache.li);
  }

  return await modelFetch();
};

