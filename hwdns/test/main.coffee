#!/usr/bin/env coffee

> ../../../../js0/conf/cron/HW.js
  @3-/hwdns

site = await hwdns(...HW)('js0.site')
await site.reset(
  ''
  {
    # A: [ "47.92.157.85" ],
    TXT: ["v=spf1 include:_spf.js0.site include:_spf.google.com -all"]
  }
)
