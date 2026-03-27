import { $ } from "zx";

export default async ({ name, scriptPath: script_path }) => {
  const { execPath: exec_path } = process;
  await $`schtasks /End /TN ${name} || true`;
  await $`schtasks /Create /F /TN ${name} /TR ${`"${exec_path}" "${script_path}" run`} /SC ONLOGON /RL HIGHEST`;
  await $`schtasks /Run /TN ${name}`;
};
