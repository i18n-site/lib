#!/usr/bin/env -S bun

import { resolve } from "node:path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { simpleGit } from "simple-git";
import gci from "./lib.js";

const { C, m, _: arg_li } = await yargs(hideBin(process.argv))
    .scriptName("gci")
    .usage("用法: $0 [选项] [提交说明]")
    .option("C", {
      type: "string",
      describe: "工作目录 (默认为当前目录)",
    })
    .option("m", {
      alias: "message",
      type: "string",
      describe: "提交说明 (如不指定则由 AI 生成)",
    })
    .help()
    .alias("h", "help")
    .parse(),
  dir = resolve(C || "."),
  msg = m || arg_li.join(" "),
  git = simpleGit(dir),
  git_url = await git.remote(["get-url", "origin"]).catch(() => "");

await gci(git_url, dir, msg);
