import { $ } from "zx";

process.env.MSYS_NO_PATHCONV = "1";

export default async ({ name, scriptPath: script_path }) => {
  try {
    await $`schtasks /End /TN ${name}`;
  } catch (e) {}

  const cmd = `schtasks /Create /F /TN ${name} /TR "node \\"${script_path}\\" run" /SC ONSTART /RL HIGHEST`;
  await $([cmd]);

  await $`schtasks /Run /TN ${name}`;
};
