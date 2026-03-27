#!/usr/bin/env bun
import { $, cd } from 'zx';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const packages = [
  'obj_replace',
  'darwin',
  'linux',
  'win32',
  'srv'
];

console.log('开始批量发布 @3-/srv 相关依赖包...\n');

for (const pkg of packages) {
  const pkgDir = join(__dirname, pkg);
  console.log(`============== 发布 ${pkg} ==============`);
  try {
    cd(pkgDir);
    // 可选：提升版本号（如果还未提升的话）
    // try { await $`npm version patch`; } catch (e) {}

    await $`npm publish --access public`;
    console.log(`✅ ${pkg} 发布成功\n`);
  } catch (err) {
    console.error(`❌ ${pkg} 发布失败:`, err.message || err);
    // 这里可以选择如果是版本冲突（已经发布过该版本），则继续，否则如果是其它错误可以中断
  }
}
console.log('✨ 所有包发布流程执行完毕。');
