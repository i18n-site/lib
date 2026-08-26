#!/usr/bin/env coffee

> @3-/dbq > $one

console.log await $one("SELECT 1")
console.log await $one("SELECT 'x'")

process.exit()
