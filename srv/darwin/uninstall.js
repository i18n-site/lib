import fs from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { $ } from "./init.js";

export default async (name) => {
  const home_dir = homedir(),
    launch_agents_dir = join(home_dir, "Library", "LaunchAgents"),
    plist_path = join(launch_agents_dir, `${name}.plist`);

  await $`launchctl bootout user/$(id -u) ${plist_path} || true`;
  await fs.rm(plist_path, { force: true });
};
