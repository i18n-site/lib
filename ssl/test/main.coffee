#!/usr/bin/env coffee

> @3-/cf:Cf
  @3-/cf/zone.js
  @3-/ssl/Freessl.js
  ../../../../js0/conf/cron/KEY.js > FREESSL

{env} = process

cf = Cf(
  env.CF_KEY
  env.CF_MAIL
)

# domain = '018007.xyz'
# host = await zone(cf, domain)
# freessl = Freessl(...FREESSL)
# r = await freessl(
#   domain
#   host.set.bind(host,'TXT')
#   host.rmByName
# )
#
# console.log(r)
