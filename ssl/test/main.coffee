#!/usr/bin/env coffee

> @3-/cf:Cf
  @3-/cf/zone.js
  @3-/ssl

{env} = process

cf = Cf(
  env.CF_KEY
  env.CF_MAIL
)

host = await zone(cf, 'js0.site')

cert = await ssl(
  host
)

console.log(cert)

# rid = await host.set(
#   'CNAME',
#   'x'
#   'xxx.c.com'
# )
# console.log rid
# console.log 'rm',await host.rmById rid
