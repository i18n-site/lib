> ioredis:Redis
  @3-/split/rsplit.js

{env} = process

hostPort = (s)=>
  [host,port] = rsplit(s,':')
  o = {
    host
  }
  if port
    o.port = +port
  o

conn = (password, user, node, db, sentinel_name, sentinel_username, sentinel_password)=>
  opt = {}
  if password
    opt.password = password
  if user
    opt.username = user

  node = node.split(' ')

  if node.length > 1
    host_port = node.map hostPort

    redis = if sentinel_name then new Redis({
      sentinels:host_port
      sentinelUsername:sentinel_username or 'default'
      sentinelPassword:sentinel_password
      name:sentinel_name
      ...opt
    }) else new Redis.Cluster(
      host_port
      redisOptions: opt
    )
  else
    if db
      opt.db = +db
    redis = new Redis {
      ...opt
      ...hostPort node[0]
    }

  redis

< new Proxy(
  {}
  get: (_, name)=>
    args = []
    for i from 'PASSWORD USER NODE DB SENTINEL_NAME SENTINEL_USER SENTINEL_PASSWORD'.split(' ')
      args.push env[name + '_' + i]
    conn ...args
)
