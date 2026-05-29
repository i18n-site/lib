import fs from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { $ } from "./init.js";

export default async (name, onErr = console.error) => {
  const home_dir = homedir(),
    launch_agents_dir = join(home_dir, "Library", "LaunchAgents"),
    plist_path = join(launch_agents_dir, `${name}.plist`);

  try {
    await $`launchctl bootout user/$(id -u) ${plist_path}`.quiet();
  } catch (e) { onErr(e); }
  await fs.rm(plist_path, { force: true });
};
