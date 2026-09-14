import { homedir } from "node:os";
import { join } from "node:path";
import { existsSync } from "node:fs";
import rJson from "@3-/read/rJson.js";

export default async () => {
  const path = join(homedir(), ".cline", "data", "settings", "providers.json");
  if (existsSync(path)) {
    return rJson(path)?.providers?.cline?.settings?.auth?.accessToken || null;
  }
  return null;
};
