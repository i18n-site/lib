import { homedir } from "os";
import { join } from "path";
import { $ } from "zx";
import gen from "@3-/srv-obj-replace/gen.js";

export default async ({ name, scriptPath: script_path }) => {
  const { execPath: exec_path } = process,
    home_dir = homedir(),
    launch_agents_dir = join(home_dir, "Library", "LaunchAgents"),
    plist_path = join(launch_agents_dir, `${name}.plist`),
    logs_dir = join(home_dir, "Library", "Logs"),
    out_log = join(logs_dir, `${name}.log`),
    err_log = join(logs_dir, `${name}.err.log`);

  gen(
    { name, execPath: exec_path, scriptPath: script_path, outLog: out_log, errLog: err_log },
    join(import.meta.dirname, "launchd.xml"),
    plist_path
  );
  await $`launchctl bootout gui/$(id -u) ${plist_path} || true`;
  await $`launchctl bootstrap gui/$(id -u) ${plist_path}`;
};
