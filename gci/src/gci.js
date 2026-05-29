#!/usr/bin/env node

import { simpleGit } from 'simple-git';

const root = await simpleGit().revparse('--show-toplevel'),
  _chdir = process.chdir(root),
  git = simpleGit(),
  status = await git.status(),
  branch = status.current,
  has_commit = !!(await git.log().catch(() => null)),
  msg = process.argv.slice(2).join(' ') || '.';

if (!has_commit) {
  await git.checkoutLocalBranch('main');
  await git.add('.');
  await git.commit('init');
  await git.push('origin', 'main', ['--set-upstream']);
  await git.checkoutLocalBranch('dev');
  await git.push('origin', 'dev', ['--set-upstream']);
  process.exit(0);
}

await git.add('.');
const res = await git.commit(msg).catch(() => null);
if (res && res.commit) {
  console.log('[' + res.branch + ' ' + res.commit + '] ' + msg + '\n ' + res.summary.changes + ' files changed, ' + res.summary.insertions + ' insertions(+), ' + res.summary.deletions + ' deletions(-)');
}

if (branch === 'main') {
  const to_dev = await git.checkout('dev').catch(() => null);
  if (!to_dev) {
    const fetch_dev = await git.fetch('origin', 'dev').catch(() => null);
    if (fetch_dev) {
      await git.checkout(['-b', 'dev', 'origin/dev']);
    } else {
      await git.checkoutLocalBranch('dev');
      await git.push('origin', 'dev', ['--set-upstream']);
    }
  }
  await git.merge(['--ff', '--no-edit', 'main']);
  await git.checkout('main');
  await git.reset(['--hard', 'HEAD~1']);
  await git.checkout('dev');
}

if (!process.env.NO_PUSH) {
  const pushed = await git.push().catch(() => null);
  if (!pushed && branch) {
    await git.fetch('origin', branch).catch(() => null);
    await git.merge(['--ff', '--no-edit', 'origin/' + branch]).catch(() => null);
    await git.push().catch(() => null);
  }
}
