#!/usr/bin/env coffee

> ./lib.js:mysqlha

import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'

argv = yargs(hideBin(process.argv))
  .option 'conf',
    alias: 'c'
    describe: 'Configuration file'
    demandOption: true
    type: 'string'
  .help()
  .argv

if argv.conf
  await mysqlha argv.conf
