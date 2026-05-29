#!/usr/bin/env node

import gci from './lib.js';
import { simpleGit } from 'simple-git';

const git = simpleGit(),
  git_url = await git.remote(['get-url', 'origin']).catch(() => ''),
  dir = process.cwd();

await gci(git_url, dir);
