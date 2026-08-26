#!/usr/bin/env coffee

> ./dir.js

import {resolve} from 'path'
import yargs from 'yargs/yargs'
import {hideBin} from 'yargs/helpers'

argv = yargs(hideBin(process.argv))
  .alias('compile', 'c')
  .describe('compile', 'compile file or dir')
  .alias('outdir','o')
  .describe('outdir', 'outdir dir')
  .alias('ext','e')
  .describe('ext', 'js / mjs')
  .alias('watch', 'w')
  .describe('watch', 'watch change')
  .alias('run', 'r')
  .describe('run', 'run command after watch change')
  .parse()

{compile,outdir,watch,ext,run} = argv

if not compile
  compile = process.cwd()

compile = resolve(compile)

await dir compile, outdir, ext or 'js'

if watch
  (
    await import('./watch.js')
  ).default(compile, outdir, run)
