import { $ } from "zx";

export default async ({ name }) => {
  await $`schtasks /End /TN ${name} || true`;
  await $`schtasks /Delete /TN ${name} /F || true`;
};
