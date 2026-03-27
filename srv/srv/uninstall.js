import { $ } from "zx";

$.verbose = true;
$.shell = process.platform === "win32" ? "cmd.exe" : "bash";

export default async (config) => {
  const { platform } = process,
    { default: uninstall } = await import(`@3-/srv-${platform}/uninstall.js`);
  await uninstall(config);
};
