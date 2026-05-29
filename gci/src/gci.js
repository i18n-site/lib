#!/usr/bin/env node

import { execSync, spawnSync } from 'child_process';

const run = (cmd, inherit) => inherit ? execSync(cmd, { stdio: 'inherit' }) : execSync(cmd, { encoding: 'utf8' }).trim(),
  branch = (process.chdir(run('git rev-parse --show-toplevel')), run('git symbolic-ref --short -q HEAD 2>/dev/null || true')),
  has_commit = run('git log --oneline -n1 >/dev/null 2>&1 && echo 1 || echo 0') === '1',
  msg = process.argv.slice(2).join(' ') || '.';

if (!has_commit) {
  run('git checkout -b main', true);
  run('git add .', true);
  run('git commit -minit', true);
  run('git push --set-upstream origin main', true);
  run('git checkout -b dev', true);
  run('git push --set-upstream origin dev', true);
  process.exit(0);
}

run('git add .', true);
spawnSync('git', ['commit', '-m', msg], { stdio: 'inherit' });

if (branch === 'main') {
  run('git checkout dev 2>/dev/null || (git fetch origin dev 2>/dev/null && git checkout -b dev origin/dev) || (git checkout -b dev && git push --set-upstream origin dev)', true);
  run('git merge --ff --no-edit main', true);
  run('git checkout main', true);
  run('git reset --hard HEAD~1', true);
  run('git checkout dev', true);
}

if (!process.env.NO_PUSH) {
  run('git push 2>/dev/null || (git fetch origin ' + branch + ' && git merge --ff --no-edit origin/' + branch + ' && git push) || true', true);
}
