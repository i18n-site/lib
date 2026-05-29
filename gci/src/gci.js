#!/usr/bin/env node

import { execSync, spawnSync } from 'child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' }),
  runStr = (cmd) => execSync(cmd, { encoding: 'utf8' }).trim();

process.chdir(runStr('git rev-parse --show-toplevel'));

const branch = runStr('git symbolic-ref --short -q HEAD 2>/dev/null || true'),
  has_commit = runStr('git log --oneline -n1 >/dev/null 2>&1 && echo 1 || echo 0') === '1';

if (!has_commit) {
  run('git checkout -b main');
  run('git add .');
  run('git commit -minit');
  run('git push --set-upstream origin main');
  run('git checkout -b dev');
  run('git push --set-upstream origin dev');
  process.exit(0);
}

run('git add .');

const msg = process.argv.slice(2).join(' ') || '.';
spawnSync('git', ['commit', '-m', msg], { stdio: 'inherit' });

if (branch === 'main') {
  run('git checkout dev 2>/dev/null || (git fetch origin dev 2>/dev/null && git checkout -b dev origin/dev) || (git checkout -b dev && git push --set-upstream origin dev)');
  run('git merge --ff --no-edit main');
  run('git checkout main');
  run('git reset --hard HEAD~1');
  run('git checkout dev');
}

if (!process.env.NO_PUSH) {
  run('git push 2>/dev/null || (git fetch origin ' + branch + ' && git merge --ff --no-edit origin/' + branch + ' && git push) || true');
}
