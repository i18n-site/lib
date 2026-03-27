import fs from "fs/promises";
import { homedir } from "os";
import { join } from "path";
import { $ } from "./init.js";

export default async ({ name }) => {
  const systemd_dir = join(homedir(), ".config", "systemd", "user"),
    service_path = join(systemd_dir, `${name}.service`);

  await $`systemctl --user disable --now ${name}.service || true`;
  await fs.rm(service_path, { force: true });
  await $`systemctl --user daemon-reload`;
};
