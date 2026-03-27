import { join } from "path";
import { $ } from "zx";
import fs from "fs/promises";
import gen from "@3-/srv-obj-replace/gen.js";
import { homedir } from "os";

export default async ({ name, scriptPath }) => {
  const { execPath } = process,
    systemdDir = join(homedir(), ".config", "systemd", "user"),
    servicePath = join(systemdDir, `${name}.service`);

  await fs.mkdir(systemdDir, { recursive: true });
  await gen(
    { name, execPath, scriptPath },
    join(import.meta.dirname, "systemd.service"),
    servicePath
  );
  await $`systemctl --user daemon-reload`;
  await $`systemctl --user enable --now ${name}.service`;
};
