#!/usr/bin/env coffee

> ./lib.js > renderDir
import yargs from 'yargs/yargs'
import {resolve} from 'path'
import {hideBin} from 'yargs/helpers'

argv = yargs(hideBin(process.argv)).options({
  'c': {
    alias: 'source',
    type: 'string',
    default: '.',
    describe: 'pug source directory'
  },
  'o': {
    alias: 'output',
    type: 'string',
    describe: 'output directory',
  },
  'w': {
    alias: 'watch',
    type: 'boolean',
    default: false,
    describe: 'watch for changes'
  }
}).parse()

srcdir = resolve(argv.source)
outdir = resolve(argv.output || srcdir)

if argv.watch
  await (
    await import(
      './watchDir.js'
    )
  ).default(
    srcdir
    outdir
  )
else
  await renderDir(srcdir, outdir)

process.exit(0)
