#!/usr/bin/env coffee

> @3-/read
  @3-/camel
  @3-/snake > SNAKE
  @3-/walk
  @3-/write
  @3-/ioredis:Redis
  fs > existsSync readdirSync
  path > join dirname basename

flagsDef = (name, flags)=>
  # TODO remvoe below lines kvrocks hack https://github.com/apache/kvrocks/issues/2133
  flags = []

  if flags.length
    def = \
    """
{function_name='#{name}',callback=#{name},flags={'#{flags.join('\',\'')}'}}
    """
  else
    def = "('#{name}',#{name})"
  return def

load = (pwd)=>
  dir_lua = join pwd, 'lua'

  lua = readdirSync(dir_lua).filter(
    (i)=>i.endsWith('.lua')
  ).map(
    (i)=> read(join dir_lua, i)
  ).join('\n')

  li = []
  name_li = []

  for i from lua.split('\n')
    i = i.trimEnd()

    trimStart = i.trimStart()
    if not trimStart
      continue

    if trimStart.startsWith('--')
      i = trimStart.slice(3)
      if i.startsWith('flags ')
        flags = flags.concat i.slice(6).trim().split(' ')
      continue

    if i.startsWith('function ')
      flags = []
      name = i.slice(9,i.indexOf('(',10)).trim()
      i = 'local '+i+'\nredis.setresp(3)'
    else if ~i.indexOf('function(')
      name = undefined

    li.push i

    if i == 'end' and name
      def = flagsDef(name,flags)
      name_li.push name
      li.push "redis.register_function#{def}"


  if name_li.length
    lua_rs = name_li.map(
      (i)=>
        "pub const #{SNAKE i}: &str = \"#{i}\";\n"
    ).join('')

  return [
    li.join('\n').trimEnd()
    lua_rs
  ]

export default (pwd, conf, name)=>
  [code, rs] = load(pwd)
  code = '#!lua name='+name+'\n'+code
  console.log code
  redis = Redis(conf)
  await redis.function(
    'LOAD'
    'REPLACE'
    code
  )
  write(join(pwd,'src/r.rs'),rs)
  return
