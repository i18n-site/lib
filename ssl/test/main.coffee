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
  domain
  (domain,val)=>
    console.log('SET TXT', domain, val)
    host.set('TXT', domain, val)
  host.rmById
)

console.log(cert)
