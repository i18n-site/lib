#!/usr/bin/env coffee

> @3-/nowts

KIND_ID = new Map

# connectionConfig =
#   host: 'gateway01.eu-central-1.prod.aws.tidbcloud.com'
#   port: 4000
#   database: 'alive'
#   user: ''
#   password: ''
#   ssl:
#     rejectUnauthorized: false  # 生产环境中应正确配置 SSL
#
# # 方法一：创建连接 (推荐)
# connection = mysql.createConnection(connectionConfig)

kindId = (name)=>
  return id

export default (kind)=>
  li = []
  [
    # errlog
    (host_li, msg)=>
      if Array.isArray(host_li)
        host_li.sort()
        host_str = host_li.join(' & ')
      else
        host_str = host_li
        host_li = [host_li]
      err_li.push [host_li, msg]
      console.error(host_str, msg)
      return

    # save
    =>
      if li.length
        console.log li
      else
        conn.query(
          'UPDATE state SET ts=? WHERE kind_id=?',
        )
      return
  ]
