#!/usr/bin/env coffee

> ./retry.js
  ./_req.js:req

export default retry (url,option)=>
  (await req(url,option)).text()
