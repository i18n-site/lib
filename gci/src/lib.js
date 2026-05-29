import { simpleGit } from "simple-git";

export default async (git_url, dir) => {
  const cwd = dir || process.cwd(),
    git = simpleGit(cwd),
    repo = await git.checkIsRepo().catch(() => false);

  if (!repo) {
    if (git_url) {
      await simpleGit().clone(git_url, cwd);
    } else {
      await git.init();
    }
  }

  const status = await git.status(),
    branch = status.current,
    has_commit = !!(await git.log().catch(() => null)),
    msg = process.argv.slice(2).join(" ") || ".";

  if (!has_commit) {
    const cur = branch || "main";
    await git.checkoutLocalBranch(cur).catch(() => null);
    await git.add(".");
    await git.commit("init");
    if (git_url) {
      await git.addRemote("origin", git_url).catch(() => null);
    }
    await git.push("origin", cur, ["--set-upstream"]).catch(() => null);
    return;
  }

  await git.add(".");
  const res = await git.commit(msg).catch(() => null);
  if (res && res.commit) {
    console.log(
      "[" +
        res.branch +
        " " +
        res.commit +
        "] " +
        msg +
        "\n " +
        res.summary.changes +
        " files changed, " +
        res.summary.insertions +
        " insertions(+), " +
        res.summary.deletions +
        " deletions(-)",
    );
  }

  if (branch === "main") {
    const temp = "gci-temp";
    await git.checkoutLocalBranch(temp);
    await git.branch(["-f", "main", "HEAD~1"]);

    if (!process.env.NO_PUSH) {
      const pushed = await git.push("origin", temp + ":dev").catch(() => null);
      if (!pushed) {
        await git.fetch("origin", "dev").catch(() => null);
        await git.merge(["--ff", "--no-edit", "origin/dev"]).catch(() => null);
        await git.push("origin", temp + ":dev").catch(() => null);
      }
    }
    await git.checkout("main");
    await git.branch(["-D", temp]);
  } else {
    if (!process.env.NO_PUSH && branch) {
      const pushed = await git.push().catch(() => null);
      if (!pushed) {
        await git.fetch("origin", branch).catch(() => null);
        await git.merge(["--ff", "--no-edit", "origin/" + branch]).catch(() => null);
        await git.push().catch(() => null);
      }
    }
  }
};
