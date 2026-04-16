#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict --experimental-wasm-modules
var argv, filename, out;

import yargs from 'yargs/yargs';

import read from '@3-/read';

import write from '@3-/write';

import {
  resolve
} from 'path';

import {
  hideBin
} from 'yargs/helpers';

import svelte from './svelte.js';


argv = yargs(hideBin(process.argv)).usage('用法: $0 <文件名> [选项]').check((argv) => {
  var err;
  if (argv._.length < 1) {
    err = "错误：必须提供一个文件名";
  } else {
    [filename] = argv._;
    if (!filename.endsWith('.svelte')) {
      err = "错误：文件名必须以 .svelte 结尾";
    }
  }
  if (err) {
    throw new Error(err);
  }
  return true;
}).option('write', {
  alias: 'w',
  description: '将结果写回文件',
  type: 'boolean'
}).alias('h', 'help').help('h').parse();

out = (await svelte(read(filename)));

if (argv.write) {
  write(filename, out);
} else {
  console.log(out);
}
