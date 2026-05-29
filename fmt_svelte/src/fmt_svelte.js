#!/usr/bin/env bun
import yargs from "yargs/yargs";
import { hideBin } from "yargs/helpers";
import read from "@3-/read";
import write from "@3-/write";
import walk from "@3-/walk";
import { statSync, existsSync } from "fs";
import { basename } from "path";
import fmt from "./fmt.js";

const argv = yargs(hideBin(process.argv))
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
      for (let i = 0; i < errs.length; ++i) {
        const e = errs[i];
        console.error(
          file +
            ":" +
            (e.line || e.start_line || "?") +
            ": " +
            e.message +
            " (" +
            (e.rule_id || "error") +
            ")",
        );
      }
      return 1;
    }
  },
  run = async (f, do_write) => {
    try {
      const content = read(f),
        [out, errors] = await fmt(content, f);

      report(f, errors);

      if (out !== undefined) {
        if (do_write) write(f, out);
        else if (!argv.write) console.log(f + ":\n" + out + "\n");
      }
    } catch (e) {
      console.error(f + ": " + e.message);
    }
  };

for (const path of paths) {
  if (!existsSync(path)) {
    console.error("路径不存在: " + path);
    continue;
  }
  const is_dir = statSync(path).isDirectory(),
    do_write = argv.write || is_dir;
  if (is_dir) {
    for await (const f of walk(path, (p) => {
      const b = basename(p);
      return b.startsWith(".") || b == "node_modules";
    }))
      await run(f, do_write);
  } else await run(path, do_write);
}
