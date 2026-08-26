#!/usr/bin/env coffee

> @3-/db_proxy > get

n = 0

while ++n < 6
  console.log n, await get('https://4.ipw.cn', {timeout: 6000})

process.exit()
