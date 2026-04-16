#!/usr/bin/env bun
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import write from "@3-/write";
import walk from "@3-/walk";
import { statSync, existsSync } from "fs";
import svelte from "./svelte.js";
import js from "./js.js";
import { basename } from "path";

const argv = yargs(hideBin(process.argv))
    .usage("用法: $0 <文件名|目录名...> [选项]")
    .check((argv) => {
      if (!argv._[0]) throw new Error("错误：必须提供至少一个文件名或目录名");
      return true;
    })
    .option("write", {
      alias: "w",
      description: "将结果写回文件",
      type: "boolean",
    })
    .alias("h", "help")
    .help("h")
    .parse(),
  paths = argv._,
  fmt = async (f, do_write) => {
    try {
      let out;
      if (f.endsWith(".svelte")) {
        out = await svelte(read(f));
      } else if (f.match(/\.(?:[mc]?js|ts)$/)) {
        out = await js(read(f));
      }
      if (out !== undefined) {
        if (do_write) write(f, out);
        else console.log(`${f}:\n${out}\n`);
      }
    } catch (e) {
      console.error(`${f}: ${e.message}`);
    }
  };

for (const path of paths) {
  if (!existsSync(path)) {
    console.error(`路径不存在: ${path}`);
    continue;
  }
  const is_dir = statSync(path).isDirectory(),
    do_write = argv.write || is_dir;
  if (is_dir) {
    for await (const f of walk(path, (p) => {
      p = basename(p);
      return p.startsWith(".") || p == "node_modules";
    })) {
      await fmt(f, do_write);
    }
  } else await fmt(path, do_write);
}
