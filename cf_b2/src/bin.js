#!/usr/bin/env bun

import Cloudflare from "cloudflare"
import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import { parse } from "psl"
import bind from "./lib.js"

const { env } = process

const cf = new Cloudflare({
  apiToken: env.CF_TOKEN,
})

const main = async (argv) => {
  const { backblazePrefix, bucket, domain } = argv

  const { domain: tld, subdomain } = parse(domain)
  const host = domain
  const backblazeb2 = `${backblazePrefix}.backblazeb2.com`

  console.log(`\n${host} → https://${backblazeb2}/${bucket}/`)

  for await (const zone of cf.zones.list({ name: tld })) {
    console.log(`ID ${zone.id}`, zone.status)
    await bind(cf, zone.id, host, backblazeb2, bucket)
  }
}

yargs(hideBin(process.argv))
  .command(
    "$0 <backblazePrefix> <bucket> <domain>",
    "绑定 Cloudflare 域名到 Backblaze B2 存储",
    (yargs) =>
      yargs
        .positional("backblazePrefix", {
          describe: "B2 域名前缀 (如 f003, f004)",
          type: "string",
        })
        .positional("bucket", {
          describe: "B2 bucket 名称",
          type: "string",
        })
        .positional("domain", {
          describe: "要绑定的域名 (如 cdn.example.com)",
          type: "string",
        }),
    main
  )
  .parse()
