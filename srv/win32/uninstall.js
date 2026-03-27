import { $ } from "zx";

process.env.MSYS_NO_PATHCONV = "1";

export default async ({ name }) => {
  await $`schtasks /End /TN ${name} || true`;
  await $`schtasks /Delete /TN ${name} /F || true`;
};
