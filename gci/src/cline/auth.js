import { homedir } from "node:os";
import { join } from "node:path";
import { readFile } from "node:fs/promises";

export default async () => {
  const path = join(homedir(), ".cline", "data", "settings", "providers.json"),
    text = await readFile(path, "utf8").catch(() => null),
    json = text ? JSON.parse(text) : null;
  return json?.providers?.cline?.settings?.auth?.accessToken || null;
};
