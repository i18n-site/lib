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
  env.EAB_KID
  env.EAB_HMAC
)(
  domain
  host.set.bind(host,'TXT')
  host.rmByName
)

console.log(cert)
