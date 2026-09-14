import { simpleGit } from "simple-git";

export default async (git, git_url, dir, repo, outHandler) => {
  if (!repo) {
    if (git_url) {
      await simpleGit().outputHandler(outHandler).clone(git_url, dir);
    } else {
      await git.init();
    }
  }
};
