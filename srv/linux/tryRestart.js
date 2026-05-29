import { $ } from "./init.js";

export default async (name) => {
  try {
    const { exitCode } = await $`systemctl --user is-active ${name}.service`.quiet().nothrow();
    if (exitCode === 0) {
      await $`systemctl --user restart ${name}.service`.quiet();
      return true;
    }
  } catch (e) {}
  return false;
};
