#!/usr/bin/env bun

import iflow from "@3-/iflow";
import 遍历 from "./walk.js";
import oxfmt from "./oxfmt.js";
import ERR from "@3-/log/ERR.js";
import log from "@3-/log";
import { $ } from "@3-/zx";

$.verbose = 1;

const retry = async (fn, ...args) => {
    let catch_n, pre_err_n, pre;
    for (;;) {
      try {
        const prompt = await fn(...args);
        if (!prompt) {
          return;
        }
        await iflow(async (send, recv) => {
          await send(prompt);
          for await (const text of recv()) {
            log(text);
          }
        });
        catch_n = 0;
        if (prompt) {
          if (prompt == pre && ++pre_err_n > 3) {
            return;
          }
          pre = prompt;
        } else {
          return;
        }
      } catch (e) {
        ERR(e);
        if (++catch_n > 3) {
          break;
        }
      }
    }
  },
  fix = async (fp) => {
    const err_li = await oxfmt(fp);
    if (err_li) {
      const err = err_li.map(({ codeframe }) => codeframe).join("\n\n");
      return "修复js错误 : " + err.replaceAll(dir, ".");
    }
  },
  lint = async () => {
    const { stdout, stderr } = await $`bun --bun run oxlint --fix --fix-suggestions`;
    if (stderr) {
      ERR(stderr);
    } else {
      if (!stdout.startsWith("Found 0 warnings and 0 errors.\n")) {
        return "修复报警, 修复后再次运行 bun run oxlint 确认无误:\n" + stdout;
      }
    }
  },
  main = async (dir) => {
    const 文件列表 = 遍历(dir);
    for (const fp of 文件列表) {
      await retry(fix, fp);
    }
    await retry(lint);
  };

await main(process.cwd());
process.exit();
