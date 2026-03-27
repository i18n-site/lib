import { join } from "path";
import { $ } from "zx";
import fs from "fs/promises";
import { homedir } from "os";

export default async ({ name }) => {
  const plistPath = join(homedir(), "Library", "LaunchAgents", `${name}.plist`);

  await $`launchctl unload -w ${plistPath}`;
  await fs.unlink(plistPath);
};
