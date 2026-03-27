export default async (name, onErr = console.error) => {
  const { platform } = process,
    { default: uninstall } = await import(`@3-/srv-${platform}/uninstall.js`);
  await uninstall(name, onErr);
};
