import { join } from "path";
import { $ } from "zx";
import fs from "fs/promises";
import gen from "@3-/srv-obj-replace/gen.js";
import { homedir } from "os";

export default async ({ name, scriptPath }) => {
  const { execPath } = process,
    home = homedir(),
    plistPath = join(home, "Library", "LaunchAgents", `${name}.plist`);

  await fs.mkdir(join(home, "Library", "LaunchAgents"), { recursive: true });
  await gen(
    { name, execPath, scriptPath, outLog: join(home, "Library", "Logs", `${name}.log`), errLog: join(home, "Library", "Logs", `${name}.err.log`) },
    join(import.meta.dirname, "launchd.xml"),
    plistPath
  );
  await $`launchctl load -w ${plistPath}`;
};
