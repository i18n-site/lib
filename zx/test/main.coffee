#!/usr/bin/env coffee

> @3-/zx > $ $raw

$.verbose = true
# console.log $"ls"
console.log await $raw ['ls']
# $.stdout = 0
# await $'ls'
