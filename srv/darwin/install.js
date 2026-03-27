import { homedir } from "os";
import { join } from "path";
import { $ } from "./init.js";
import gen from "@3-/obj_replace/gen.js";

export default async (name, exec_path, args) => {
  const home_dir = homedir(),
    launch_agents_dir = join(home_dir, "Library", "LaunchAgents"),
    plist_path = join(launch_agents_dir, `${name}.plist`),
    logs_dir = join(home_dir, "Library", "Logs"),
    out_log = join(logs_dir, `${name}.log`),
    err_log = join(logs_dir, `${name}.err.log`);

  gen(
    { name, execPath: exec_path, scriptPath: args, outLog: out_log, errLog: err_log },
    join(import.meta.dirname, "launchd.xml"),
    plist_path
  );
  await $`launchctl bootstrap user/$(id -u) ${plist_path}`;
};
