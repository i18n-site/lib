#!/usr/bin/env coffee

> @3-/retry
  ./_req.js:req
  msgpackr > unpack

export default retry (url,option)=>
  unpack new Uint8Array(
    await (await req(url,option)).arrayBuffer()
  )
