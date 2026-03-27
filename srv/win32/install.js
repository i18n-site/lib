import { $ } from "zx";

process.env.MSYS_NO_PATHCONV = "1";

export default async ({ name, scriptPath: script_path }) => {
  const { execPath: exec_path } = process;
  try {
    await $`schtasks /End /TN ${name}`;
  } catch (e) {}

  const cmd = `schtasks /Create /F /TN ${name} /TR "\\"${exec_path}\\" \\"${script_path}\\" run" /SC ONLOGON /RL HIGHEST`;
  await $([cmd]);

  await $`schtasks /Run /TN ${name}`;
};
