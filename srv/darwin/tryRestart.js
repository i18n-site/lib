import { $ } from "./init.js";

export default async (name) => {
  try {
    const { stdout } = await $`launchctl list`.quiet();
    if (stdout.includes(`\t${name}\n`)) {
      await $`launchctl kickstart -k user/$(id -u)/${name}`.quiet();
      return true;
    }
  } catch (e) {}
  return false;
};
