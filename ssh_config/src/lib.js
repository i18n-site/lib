import write from "@3-/write";
import { tmpdir } from "node:os";
import { mkdtempSync, rmdirSync } from "node:fs";
import { join } from "node:path";

export default (name_ip_li) => {
  const ssh_config = mkdtempSync(join(tmpdir(), "ssh_config-"));
  rmdirSync(ssh_config);
  write(
    ssh_config,
    "Host *\nStrictHostKeyChecking accept-new\n" +
      name_ip_li
        .map(
          ([name, ip]) =>
            `Host ${name}
HostName ${ip}
User root`,
        )
        .join("\n"),
  );
  return ssh_config;
};
