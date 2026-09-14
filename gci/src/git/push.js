export default async (git, branch, from, to) => {
  const target_li = from && to ? [from + ":" + to] : [],
    pushed = await git.push("origin", ...target_li).catch(() => null);
  if (!pushed) {
    const dest = to || branch;
    await git.fetch("origin", dest).catch(() => null);
    await git.merge(["--ff", "--no-edit", "origin/" + dest]).catch(() => null);
    await git.push("origin", ...target_li).catch(() => null);
  }
};
