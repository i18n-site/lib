import { $ } from "zx";

$.verbose = true;

export default async (config) => {
  const { platform } = process,
    { default: install } = await import(`@3-/srv-${platform}/install.js`);
  await install(config);
};
