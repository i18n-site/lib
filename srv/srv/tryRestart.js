export default async (name) => {
  const { platform } = process,
    { default: tryRestart } = await import(`@3-/srv-${platform}/tryRestart.js`);
  return await tryRestart(name);
};
