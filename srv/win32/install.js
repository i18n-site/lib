import { $ } from "./init.js";

export default async ({ name, scriptPath: script_path }) => {
  try {
    await $`schtasks /End /TN ${name}`;
  } catch (e) {}

  const cmd = `schtasks /Create /F /TN ${name} /TR "\\"${process.execPath}\\" \\"${script_path}\\" run" /SC ONLOGON`;
  await $([cmd]);

  await $`schtasks /Run /TN ${name}`;
};
