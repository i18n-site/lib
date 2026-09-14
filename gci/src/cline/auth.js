import { homedir } from "node:os";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export default async () => {
  const path = join(homedir(), ".cline", "data", "settings", "providers.json"),
    readJson = async () => {
      if (typeof Bun !== "undefined") {
        const file = Bun.file(path);
        return (await file.exists()) ? await file.json() : null;
      }
      const text = await readFile(path, "utf8").catch(() => null);
      return text ? JSON.parse(text) : null;
    },
    json = await readJson();
  return json?.providers?.cline?.settings?.auth?.accessToken || null;
};
