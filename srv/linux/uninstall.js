import { join } from "path";
import { $ } from "zx";
import fs from "fs/promises";
import { homedir } from "os";

export default async ({ name }) => {
  const servicePath = join(homedir(), ".config", "systemd", "user", `${name}.service`);

  await $`systemctl --user disable --now ${name}.service`;
  await fs.unlink(servicePath);
  await $`systemctl --user daemon-reload`;
};
