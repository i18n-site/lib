import ERR from "@3-/log/ERR.js";
import commitVerify from "./verify.js";

export default async (git, git_url, branch, logStep) => {
  logStep("正在暂存文件...");
  const cur = branch || "main";
  await git.checkoutLocalBranch(cur).catch(() => null);
  await git.add(".");

  logStep("正在提交初始版本...");
  const res = await git.commit("init"),
    verified = await commitVerify(git, res?.commit);
  if (!verified) {
    ERR("初始版本提交校验失败");
    process.exit(1);
  }

  logStep("正在关联远程仓库...");
  if (git_url) {
    await git.addRemote("origin", git_url).catch(() => null);
  }

  logStep("正在推送初始版本到远程...");
  await git.push("origin", cur, ["--set-upstream"]).catch(() => null);
};
