export default async (config) => {
  const { platform } = process,
    { default: uninstall } = await import(`@3-/srv-${platform}/uninstall.js`);
  await uninstall(config);
};
