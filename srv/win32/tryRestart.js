import { $ } from "./init.js";

export default async (name) => {
  try {
    const { stdout } = await $`schtasks /Query /TN ${name}`.quiet();
    if (stdout.includes(name)) {
      try {
        await $`schtasks /End /TN ${name}`.quiet();
      } catch (e) {}
      await $`schtasks /Run /TN ${name}`.quiet();
      return true;
    }
  } catch (e) {}
  return false;
};
