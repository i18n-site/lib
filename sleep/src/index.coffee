#!/usr/bin/env coffee

< (n)=>
  new Promise (resolve)=>
    setTimeout(
      resolve
      n
    )
    return
