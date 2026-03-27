import { which } from "zx";

export default async (name, scriptPath) => {
  const { execPath: ep, platform } = process,
    exec = ep.match(/(node|bun)(\.exe)?$/) ? ep : await which("node", { nothrow: true }) || await which("bun"),
    { default: install } = await import(`@3-/srv-${platform}/install.js`);
  await install(name, exec, scriptPath);
};
