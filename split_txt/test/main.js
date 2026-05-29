#!/usr/bin/env bun

import { join } from 'path'
import { readFileSync } from 'node:fs';
import splitTxt from '../src/lib.js';

const chunks = splitTxt(
  readFileSync(join(import.meta.dirname, 'test.txt')),
  512
);
chunks.forEach((chunk, index) => {
  console.log(`\n--- 段落 ${index + 1} (字数: ${chunk.length}) ---`);
  console.log(chunk);
});

