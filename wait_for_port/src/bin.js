#!/usr/bin/env bun
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import { $ } from "zx";
import sleep from "@3-/sleep";
import checkPort from "./lib.js";

const argv = yargs(hideBin(process.argv))
    .usage("用法: $0 <端口或网址> [命令]")
    .demandCommand(1, "缺少参数：端口或网址")
    .parse(),
  [url, cmd] = argv._,
  li = String(url).split(":"),
  [host, port] = li.length > 1 ? [li[0], +li[1]] : ["127.0.0.1", +li[0]];

if (!(await checkPort(host, port))) {
  if (cmd) {
    await $(["sh -c " + cmd]);
  }
  while (!(await checkPort(host, port))) {
    await sleep(1000);
  }
}
process.exit();
