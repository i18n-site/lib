#!/usr/bin/env coffee

> @3-/retry
  ./_req.js:req

export default retry (url,option)=>
  (await req(url,option)).text()
