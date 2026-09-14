import { simpleGit } from "simple-git";
import { green } from "@3-/log/GREEN.js";
import repoInit from "./git/init.js";
import outHandler from "./git/outHandler.js";
import commitFirst from "./git/commitFirst.js";
import commitNormal from "./git/commitNormal.js";

export default async (git_url, dir, msg) => {
  const logStep = (msg) => console.log(green(msg)),
    git = simpleGit(dir).outputHandler(outHandler),
    repo = await git.checkIsRepo().catch(() => false);

  await repoInit(git, git_url, dir, repo, outHandler);

  const status = await git.status(),
    branch = status.current,
    has_commit = !!(await git.log().catch(() => null));

  if (!has_commit) {
    await commitFirst(git, git_url, branch, logStep);
  } else {
    await commitNormal(git, branch, logStep, msg, dir);
  }
};

