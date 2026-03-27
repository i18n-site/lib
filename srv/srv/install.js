import { which } from "zx";

export default async ({ name, scriptPath: script_path }) => {
  const { execPath: ep, platform } = process,
    exec = ep.match(/(node|bun)(\.exe)?$/) ? ep : await which("node", { nothrow: true }) || await which("bun"),
    { default: install } = await import(`@3-/srv-${platform}/install.js`);
  await install([name, exec, script_path]);
};
