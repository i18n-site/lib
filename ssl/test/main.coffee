#!/usr/bin/env coffee

> @3-/cf:Cf
  @3-/cf/zone.js
  @3-/ssl

{env} = process

cf = Cf(
  env.CF_KEY
  env.CF_MAIL
)

domain = 'js0.site'
host = await zone(cf, domain)

cert = await ssl(
  host
  host.set.bind(host,'CNAME')
  host.rmById
)

console.log(cert)

# rid = await host.set(
#   'CNAME',
#   'x'
#   'val'
# )
# console.log rid
# console.log 'rm',await host.rmById rid
