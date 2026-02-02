#!/usr/bin/env coffee

> mysql2/promise > createPool
  lodash-es/merge.js

# {all_proxy} = process.env

# if all_proxy
#   proxy = new URL(all_proxy)
#   console.log proxy

export default (uri, option={}) =>
  createPool merge(
    {
      connectionLimit: 3
      enableKeepAlive: true
      idleTimeout: 60000
      queueLimit: 0
      uri
      rowsAsArray: true
      typeCast: (field, next)=>
        {type} = field
        if (
          not [32,512].includes(
            field.length
          ) and type == 'VAR_STRING'
        ) or type.endsWith('BLOB')
          return field.buffer().toString('utf8')
        return next()
      waitForConnections: true
      ssl:
        rejectUnauthorized: false
    }
    option
  )
