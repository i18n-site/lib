#!/usr/bin/env coffee

> @3-/zx > $

$.verbose = true

await $'ls'
$.stdout = 0
await $'ls'
