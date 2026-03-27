export default async (name) => {
  const { platform } = process,
    { default: uninstall } = await import(`@3-/srv-${platform}/uninstall.js`);
  await uninstall(name);
};
