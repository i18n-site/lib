#!/usr/bin/env coffee

> @3-/net/aton
  @3-/net/ntoa

ip = '244.178.44.111'

ip_int = aton ip

console.log ip, ip_int, ntoa(ip_int)
