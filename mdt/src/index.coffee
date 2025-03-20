#!/usr/bin/env coffee

> yargs
  ./make.js
  path > resolve

{dir} = yargs(process.argv[2..])
  .command('$0 <dir>', 'Process the folder', (yargs) =>
    yargs.positional('dir',
      describe: 'Folder path',
      type: 'string'
    )
  )
  .demandCommand(1, 'Need provide a folder path')
  .strict()
  .argv

await make resolve dir
process.exit()
