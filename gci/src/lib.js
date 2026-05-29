import { existsSync, mkdirSync } from "fs";
import { simpleGit } from "simple-git";
import { createInterface } from "readline";
import bar from "@3-/bar";
import ERR from "@3-/log/ERR.js";
import ai from "./ai.js";

export default async (git_url, dir) => {
  const BAR = bar(5),
    cwd = dir || process.cwd(),
    outHandler = (command, stdout, stderr) => {
      const lineLog = (stream) => {
        createInterface({ input: stream }).on("line", (line) => {
          if (line.trim()) {
            BAR.log("[" + command + "] " + line);
          }
        });
      };
      lineLog(stdout);
      lineLog(stderr);
    },
    git = simpleGit(cwd).outputHandler(outHandler),
    repo = await git.checkIsRepo().catch(() => false);

  if (!repo) {
    if (git_url) {
      await simpleGit().outputHandler(outHandler).clone(git_url, cwd);
    } else {
      await git.init();
    }
  }
  BAR();

  const status = await git.status(),
    branch = status.current,
    has_commit = !!(await git.log().catch(() => null)),
    pushRetry = async (from, to) => {
      const target = from && to ? [from + ":" + to] : [],
        pushed = await git.push("origin", ...target).catch(() => null);
      if (!pushed) {
        const dest = to || branch;
        await git.fetch("origin", dest).catch(() => null);
        await git.merge(["--ff", "--no-edit", "origin/" + dest]).catch(() => null);
        await git.push("origin", ...target).catch(() => null);
      }
    };

  if (!has_commit) {
    const cur = branch || "main";
    await git.checkoutLocalBranch(cur).catch(() => null);
    await git.add(".");
    BAR();
    await git.commit("init");
    BAR();
    if (git_url) {
      await git.addRemote("origin", git_url).catch(() => null);
    }
    BAR();
    await git.push("origin", cur, ["--set-upstream"]).catch(() => null);
    BAR();
    return;
  }

  await git.add(".");
  BAR();

  const diff_text = await git.diff(["--cached"]);
  if (!diff_text.trim()) {
    console.log("没有改动");
    return;
  }

  const cli_msg = process.argv.slice(2).join(" ");
  let msg = cli_msg;

  if (!msg) {
    console.log("[信息] 正在请求 Opencode SDK 自动生成提交消息...");
    msg = await ai(diff_text);
    if (!msg) {
      ERR("自动生成提交消息失败");
      process.exit(1);
    }
  }
  BAR();

  const res = await git.commit(msg).catch(() => null);
  if (res && res.commit) {
    const { branch: b, commit: c, summary: s } = res;
    console.log(
      "[" +
        b +
        " " +
        c +
        "] " +
        msg +
        "\n " +
        s.changes +
        " 个文件被修改，" +
        s.insertions +
        " 处插入(+)，" +
        s.deletions +
        " 处删除(-)",
    );
  }
  BAR();

  if (branch === "main") {
    const temp = "gci-temp";
    await git.checkoutLocalBranch(temp);
    await git.branch(["-f", "main", "HEAD~1"]);

    if (!process.env.NO_PUSH) {
      await pushRetry(temp, "dev");
    }
    await git.checkout("main");
    await git.branch(["-D", temp]);
  } else {
    if (!process.env.NO_PUSH && branch) {
      await pushRetry();
    }
  }
  BAR();
};
