#!/usr/bin/env -S bun

import gci from "./lib.js";
import { simpleGit } from "simple-git";

const git = simpleGit(),
  git_url = await git.remote(["get-url", "origin"]).catch(() => ""),
  dir = process.cwd(),
  msg = process.argv.slice(2).join(" ");

await gci(git_url, dir, msg);
