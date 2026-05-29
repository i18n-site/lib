import { $ } from "./init.js";

export default async (name, onErr = console.error) => {
  try { await $`schtasks /End /TN ${name}`; } catch (e) { onErr(e); }
  try { await $`schtasks /Delete /TN ${name} /F`; } catch (e) { onErr(e); }
};
