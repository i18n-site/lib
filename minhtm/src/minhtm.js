#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict --experimental-wasm-modules
import walk from '@3-/walk';

import {
  basename
} from 'path';

import {
  cwd
} from 'process';

import minhtm from './lib.js';

import read from '@3-/read';

import {
  writeFileSync
} from 'fs';

await (async() => {
  var i, p, ref;
  ref = walk(cwd(), (dir) => {
    var b;
    b = basename(dir);
    return b === 'node_modules' || b[0] === '.';
  });
  for await (i of ref) {
    p = i.lastIndexOf('.');
    if (p > 0) {
      if (['htm', 'html'].includes(i.slice(p + 1))) {
        writeFileSync(i, (await minhtm(read(i))));
      }
    }
  }
})();
