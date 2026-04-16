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

const 
  argv = yargs(hideBin(process.argv))
    .usage("用法: $0 <文件名|目录名...> [选项]")
    .check((v) => {
      if (!v._[0]) throw new Error("错误：必须提供至少一个文件名或目录名");
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
  report = (file, errs) => {
    if (errs?.length) {
      errs.forEach(({ line, start_line, message, ruleId }) => console.error(`${file}:${line || start_line || "?"}: ${message} (${ruleId || 'error'})`));
      return 1;
    }
  },
  fmt = async (f, do_write) => {
    try {
      const 
        content = read(f),
        is_svelte = f.endsWith(".svelte");
      let out, errors = [];

      if (is_svelte || f.match(/\.(?:[mc]?js|ts)$/)) {
        [out, errors] = await (is_svelte ? svelte : js)(content, f);
      }

      report(f, errors);

      if (out !== undefined) {
        if (do_write) write(f, out);
        else if (!argv.write) console.log(`${f}:\n${out}\n`);
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
  const 
    is_dir = statSync(path).isDirectory(),
    do_write = argv.write || is_dir;
  if (is_dir) {
    for await (const f of walk(path, (p) => {
      const b = basename(p);
      return b.startsWith(".") || b == "node_modules";
    })) await fmt(f, do_write);
  } else await fmt(path, do_write);
}

