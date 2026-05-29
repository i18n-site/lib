import { homedir } from "os";
import { join } from "path";
import { $ } from "./init.js";
import gen from "@3-/obj_replace/gen.js";

export default async (name, exec_path, args) => {
  const systemd_dir = join(homedir(), ".config", "systemd", "user"),
    service_path = join(systemd_dir, `${name}.service`);

  gen(
    { name, execPath: exec_path, scriptPath: args },
    join(import.meta.dirname, "systemd.service"),
    service_path
  );
  await $`systemctl --user daemon-reload`;
  await $`systemctl --user enable --now ${name}.service`;
  try {
    await $`loginctl enable-linger $(whoami)`;
  } catch (e) {
    console.warn(e);
  }
};
