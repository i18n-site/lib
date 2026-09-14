const singlePush = async (git, branch, from, to) => {
    const target_li = from && to ? [from + ":" + to] : [branch],
      pushed = await git.push("origin", ...target_li).catch(() => null);
    if (!pushed) {
      const dest = to || branch;
      await git.fetch("origin", dest).catch(() => null);
      await git
        .merge(["--ff", "--no-edit", "origin/" + dest])
        .catch(() => null);
      await git.push("origin", ...target_li).catch(() => null);
    }
  },
  devPush = async (git) => {
    await singlePush(git, "dev");

    const pushed_main = await git
      .push("origin", "dev:main")
      .catch(() => null);

    if (!pushed_main) {
      await git.fetch("origin", "main").catch(() => null);
      await git.merge(["--no-edit", "origin/main"]).catch(() => null);
      await git.push("origin", "dev").catch(() => null);
      await git.push("origin", "dev:main").catch(() => null);
    }

    await git.branch(["-f", "main", "dev"]).catch(() => null);
  };

export default async (git, branch) =>
  branch === "dev" ? devPush(git) : singlePush(git, branch);

