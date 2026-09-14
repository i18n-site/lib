import { gray } from "@3-/log/GRAY.js";
import { green } from "@3-/log/GREEN.js";
import ERR from "@3-/log/ERR.js";
import ai from "../ai.js";
import branchPush from "./push.js";
import commitVerify from "./verify.js";

export default async (git, branch, logStep, msg, dir) => {
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
    commit_msg = await ai(git, diff_text, dir);
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

  const verified = await commitVerify(git, res.commit);
  if (!verified) {
    ERR("Git 提交校验失败：最新提交与暂存区状态不一致");
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
    await branchPush(git, branch);
  }
};
