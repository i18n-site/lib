#!/usr/bin/env coffee

> mysql2/promise > createConnection

export default (host,port,user,password,option)=>
  opt = {
    host
    port
    user
    password
    connectTimeout: 10000
    disableEval: true
  }
  if option
    opt = Object.assign(opt, option)

  await createConnection(opt)
