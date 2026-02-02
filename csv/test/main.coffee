#!/usr/bin/env coffee

> @3-/csv
  @3-/uridir
  path > join

ROOT = uridir(import.meta)

for await i from csv join ROOT,'test.csv'
  console.log i
