import { existsSync, mkdirSync } from 'fs';
import { simpleGit } from 'simple-git';
import { createOpencode } from '@opencode-ai/sdk';

const aiInit = async (title) => {
  const { client, server } = await createOpencode(),
    { data: { id: session_id } } = await client.session.create({ body: { title } }),
    run = async (prompt_text) => {
      const res = await client.session.prompt({
        path: { id: session_id },
        body: {
          parts: [{ type: "text", text: prompt_text }],
        },
      });
      const parts = res.data?.parts;
      if (parts) {
        const reasoning = parts.filter((p) => p.type === "reasoning").map((p) => p.text).join(""),
          reply = parts.filter((p) => p.type === "text").map((p) => p.text).join("");
        if (reasoning) {
          console.log("\n💡 " + reasoning);
        }
        console.log("\n← " + reply);
        return reply;
      }
      if (res.data?.info?.error) {
        throw new Error(JSON.stringify(res.data.info.error));
      }
      return "";
    };

  run[Symbol.asyncDispose] = async () => {
    await server.close();
  };
  return run;
};

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
    has_commit = !!(await git.log().catch(() => null));

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

  const has_changes = await git.diff(['--cached', '--quiet']).catch(() => 'changed') === 'changed';
  if (!has_changes) {
    console.log("没有改动");
    return;
  }

  const cli_msg = process.argv.slice(2).join(' ');
  let msg = cli_msg;

  if (!msg) {
    const diff_text = await git.diff(['--cached']),
      prompt_text = "根据以下代码改动，生成一句话的git提交消息，格式如<type>: <中文标题> / <English Subject>。不要返回其他多余的说明，仅返回提交消息即可。\n\n" + diff_text;

    console.log("[信息] 正在请求 Opencode SDK 自动生成提交消息...");

    await using ai = await aiInit("gci-commit");
    msg = (await ai(prompt_text))?.trim();
    if (!msg) {
      throw new Error("模型返回的提交消息为空");
    }
    console.log("[成功] 提交消息已生成：\n" + msg);
  }

  const res = await git.commit(msg).catch(() => null);
  if (res && res.commit) {
    console.log('[' + res.branch + ' ' + res.commit + '] ' + msg + '\n ' + res.summary.changes + ' files changed, ' + res.summary.insertions + ' insertions(+), ' + res.summary.deletions + ' deletions(-)');
  }

  if (branch === 'main') {
    const temp = 'gci-temp';
    await git.checkoutLocalBranch(temp);
    await git.branch(['-f', 'main', 'HEAD~1']);

    if (!process.env.NO_PUSH) {
      const pushed = await git.push('origin', temp + ':dev').catch(() => null);
      if (!pushed) {
        await git.fetch('origin', 'dev').catch(() => null);
        await git.merge(['--ff', '--no-edit', 'origin/dev']).catch(() => null);
        await git.push('origin', temp + ':dev').catch(() => null);
      }
    }
    await git.checkout('main');
    await git.branch(['-D', temp]);
  } else {
    if (!process.env.NO_PUSH && branch) {
      const pushed = await git.push().catch(() => null);
      if (!pushed) {
        await git.fetch('origin', branch).catch(() => null);
        await git.merge(['--ff', '--no-edit', 'origin/' + branch]).catch(() => null);
        await git.push().catch(() => null);
      }
    }
  }
};
