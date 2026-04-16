#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict --experimental-wasm-modules
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import write from "@3-/write";
import walk from "@3-/walk";
import { statSync } from "fs";
import svelte from "./svelte.js";

const argv = yargs(hideBin(process.argv))
    .usage("用法: $0 <文件名|目录名> [选项]")
    .check((argv) => {
      if (!argv._[0]) throw new Error("错误：必须提供一个文件名或目录名");
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
  [path] = argv._,
  is_dir = statSync(path).isDirectory(),
  do_write = argv.write || is_dir,
  fmt = async (f) => {
    if (f.endsWith(".svelte")) {
      const out = await svelte(read(f));
      if (do_write) write(f, out);
      else console.log(`${f}:\n${out}\n`);
    }
  };

if (is_dir) {
  for await (const f of walk(path, (p) => !p.startsWith(".") && p !== "node_modules")) {
    await fmt(f);
  }
} else await fmt(path);
