import { $ } from "zx";

export default async ({ name }) => {
  try { await $`schtasks /End /TN ${name}`; } catch (e) {}
  try { await $`schtasks /Delete /TN ${name} /F`; } catch (e) {}
};
