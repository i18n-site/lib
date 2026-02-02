#!/usr/bin/env coffee

> @3-/deps
  @3-/uridir
  path > dirname

ROOT = dirname uridir(import.meta)

console.log deps ROOT
