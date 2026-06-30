#!/usr/bin/env coffee

> @3-/tcpping
  ../lib/ping.js

console.log await tcpping '81.70.124.99', 80
console.log await ping '81.70.124.99', 80
