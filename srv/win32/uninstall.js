import { $ } from "zx";

export default async ({ name }) => {
  await $`schtasks /Delete /F /TN ${name}`;
};
