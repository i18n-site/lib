#!/usr/bin/env coffee

> yargs/yargs
  @3-/read
  @3-/write
  path > resolve
  yargs/helpers > hideBin
  ./svelte.js

+ filename

argv = yargs(hideBin(process.argv))
  .usage('用法: $0 <文件名> [选项]')
  .check(
    (argv) =>
      if argv._.length < 1
        err = "错误：必须提供一个文件名"
      else
        [
          filename
        ] = argv._
        if not filename.endsWith('.svelte')
          err = "错误：文件名必须以 .svelte 结尾"
      if err
        throw new Error(err)
      return true
  )
  .alias('h', 'help')
  .help('h')
  .parse()


write(
  filename
  await svelte read filename
)
