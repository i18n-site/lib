#!/usr/bin/env coffee

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0
r = await fetch(
  "https://127.0.0.1:7775/tranYml",
  headers: {
    T: "obys55ClzA2XmgEB",
  }
  body: ""
  method: "POST"
)
console.log r.status
console.log Buffer.from await r.arrayBuffer()
