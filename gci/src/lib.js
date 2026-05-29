import { existsSync, mkdirSync } from 'fs';
import { simpleGit } from 'simple-git';
import ai from './ai.js';

export default async (git_url, dir) => {
  const cwd = dir || process.cwd(),
    git = simpleGit(cwd),
    repo = await git.checkIsRepo().catch(() => false);

  if (!repo) {
    if (git_url) {
      await simpleGit().clone(git_url, cwd);
    } else {
      await git.init();
    }
  }

  const status = await git.status(),
    branch = status.current,
    has_commit = !!(await git.log().catch(() => null)),
    pushRetry = async (from, to) => {
      const target = from && to ? [from + ':' + to] : [],
        pushed = await git.push('origin', ...target).catch(() => null);
      if (!pushed) {
        const dest = to || branch;
        await git.fetch('origin', dest).catch(() => null);
        await git.merge(['--ff', '--no-edit', 'origin/' + dest]).catch(() => null);
        await git.push('origin', ...target).catch(() => null);
      }
    };

  if (!has_commit) {
    const cur = branch || 'main';
    await git.checkoutLocalBranch(cur).catch(() => null);
    await git.add('.');
    await git.commit('init');
    if (git_url) {
      await git.addRemote('origin', git_url).catch(() => null);
    }
    await git.push('origin', cur, ['--set-upstream']).catch(() => null);
    return;
  }

  await git.add('.');

  const diff_text = await git.diff(['--cached']);
  if (!diff_text.trim()) {
    console.log("没有改动");
    return;
  }

  const cli_msg = process.argv.slice(2).join(' ');
  let msg = cli_msg;

  if (!msg) {
    console.log("[信息] 正在请求 Opencode SDK 自动生成提交消息...");
    msg = await ai(diff_text);
    if (!msg) {
      throw new Error("模型返回的提交消息为空");
    }
    console.log("[成功] 提交消息已生成：\n" + msg);
  }

  const res = await git.commit(msg).catch(() => null);
  if (res && res.commit) {
    const { branch: b, commit: c, summary: s } = res;
    console.log('[' + b + ' ' + c + '] ' + msg + '\n ' + s.changes + ' files changed, ' + s.insertions + ' insertions(+), ' + s.deletions + ' deletions(-)');
  }

  if (branch === 'main') {
    const temp = 'gci-temp';
    await git.checkoutLocalBranch(temp);
    await git.branch(['-f', 'main', 'HEAD~1']);

    if (!process.env.NO_PUSH) {
      await pushRetry(temp, 'dev');
    }
    await git.checkout('main');
    await git.branch(['-D', temp]);
  } else {
    if (!process.env.NO_PUSH && branch) {
      await pushRetry();
    }
  }
};
