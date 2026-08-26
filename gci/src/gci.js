#!/usr/bin/env node

import gci from "./lib.js";
import { simpleGit } from "simple-git";

const run = async () => {
  const git = simpleGit(),
    git_url = await git.remote(["get-url", "origin"]).catch(() => ""),
    dir = process.cwd(),
    msg = process.argv.slice(2).join(" ");
  await gci(git_url, dir, msg);
};

await run();

export default run;
