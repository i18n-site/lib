import { $ } from "./init.js";

export default async (name, exec_path, args) => {
  try {
    await $`schtasks /End /TN ${name}`;
  } catch (e) {}

  const cmd = `schtasks /Create /F /TN ${name} /TR "\\"${exec_path}\\" \\"${args}\\" run" /SC ONLOGON`;
  await $([cmd]);

  await $`schtasks /Run /TN ${name}`;
};
