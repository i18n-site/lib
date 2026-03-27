import { $ } from "zx";

export default async ({ name, scriptPath }) => {
  const { execPath } = process;
  await $`schtasks /Create /F /TN ${name} /TR ${`"${execPath}" "${scriptPath}" run`} /SC ONLOGON /RL HIGHEST`;
  await $`schtasks /Run /TN ${name}`;
};
