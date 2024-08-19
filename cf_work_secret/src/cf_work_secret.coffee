#!/usr/bin/env coffee

> ./lib.js:run
  path > resolve dirname join
  @3-/read

import {hideBin} from 'yargs/helpers'
import {load} from 'js-toml'
import yargs from 'yargs/yargs'

argv = yargs(hideBin(process.argv))
  .alias('env', 'e')
  .describe('env', 'dot env file ( default .dev.vars )')
  .parse()

{env} = argv

env = resolve env or '.dev.vars'

toml = load read join(
  dirname env
  'wrangler.toml'
)

{
  CLOUDFLARE_KEY
  CLOUDFLARE_EMAIL
} = process.env

cf_env = []

for k from ['CLOUDFLARE_KEY', 'CLOUDFLARE_EMAIL']
  v = process.env[k]
  if not v
    console.log "❌ env #{k} must be set"
    process.exit(1)
  cf_env.push v

await run(
  [
    ...cf_env
    toml.account_id
    toml.name
  ]
  env
)

process.exit()
