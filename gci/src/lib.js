import { simpleGit } from "simple-git";
import { createInterface } from "readline";
import { gray } from "@3-/log/GRAY.js";
import { green } from "@3-/log/GREEN.js";
import ERR from "@3-/log/ERR.js";
import ai from "./ai.js";

const initRepo = async (git, git_url, dir, repo, outHandler) => {
    if (!repo) {
      if (git_url) {
        await simpleGit().outputHandler(outHandler).clone(git_url, dir);
      } else {
        await git.init();
      }
    }
  },
  firstCommit = async (git, git_url, branch, logStep) => {
    logStep("正在暂存文件...");
    const cur = branch || "main";
    await git.checkoutLocalBranch(cur).catch(() => null);
    await git.add(".");

    logStep("正在提交初始版本...");
    await git.commit("init");

    logStep("正在关联远程仓库...");
    if (git_url) {
      await git.addRemote("origin", git_url).catch(() => null);
    }

    logStep("正在推送初始版本到远程...");
    await git.push("origin", cur, ["--set-upstream"]).catch(() => null);
  },
  normalCommit = async (git, branch, pushRetry, logStep, msg) => {
    logStep("正在暂存改动...");
    await git.add(".");

    const diff_text = await git.diff(["--cached"]);
    if (!diff_text.trim()) {
      console.log(gray("没有改动"));
      return;
    }

    logStep("正在请求 AI 生成提交消息...");
    let commit_msg = msg;
    if (!commit_msg) {
      commit_msg = await ai(git, diff_text);
      if (!commit_msg) {
        ERR("自动生成提交消息失败");
        process.exit(1);
      }
    }

    logStep("正在提交改动...");
    let res;
    try {
      res = await git.commit(commit_msg);
    } catch (err) {
      ERR(err?.message || err);
      process.exit(1);
    }
    if (!res || !res.commit) {
      process.exit(1);
    }
    const { branch: b, commit: c, summary: s } = res;
    console.log(
      gray("[" + b + " " + c + "] ") +
        green(commit_msg) +
        gray(
          "\n " +
            s.changes +
            " 个文件被修改，" +
            s.insertions +
            " 处插入(+)，" +
            s.deletions +
            " 处删除(-)",
        ),
    );

    logStep("正在推送代码到远程...");
    if (!process.env.NO_PUSH && branch) {
      await pushRetry();
    }
  };

export default async (git_url, dir, msg) => {
  const logStep = (msg) => console.log(green(msg)),
    outHandler = (command, stdout, stderr, args) => {
      const sub = (args && args[0]) || command,
        prefix = command === "git" && sub ? "git " + sub : command;
      if (sub === "diff" || sub === "status" || sub === "log" || sub === "rev-parse") {
        return;
      }
      const lineLog = (stream, isError) => {
        createInterface({ input: stream }).on("line", (line) => {
          if (line.trim()) {
            if (isError) {
              if (/error:|fatal:/i.test(line)) {
                ERR(gray("[" + prefix + "]") + " " + line);
              } else {
                console.log(gray("[" + prefix + "] " + line));
              }
            } else {
              console.log(gray("[" + prefix + "]") + " " + line);
            }
          }
        });
      };
      lineLog(stdout, false);
      lineLog(stderr, true);
    },
    git = simpleGit(dir).outputHandler(outHandler),
    repo = await git.checkIsRepo().catch(() => false);

  await initRepo(git, git_url, dir, repo, outHandler);

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
    await firstCommit(git, git_url, branch, logStep);
  } else {
    await normalCommit(git, branch, pushRetry, logStep, msg);
  }
};
