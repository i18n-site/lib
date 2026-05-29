#!/usr/bin/env coffee

> @3-/token/decode.js

SK = Buffer.from(process.env.TOKEN_SK,'base64')
TOKEN = 'djoU3c3G6Y1wCoCt4gQEjnY'

console.log await decode SK, TOKEN
