#!/usr/bin/env coffee

> @3-/read
  dotenv > parse
  path > basename
  dotenv-expand > expand

stringify = (o)=>
  result = ''
  for [key, val] from Object.entries(o)
    if key
      result += "#{key}=#{JSON.stringify(val)}\n"
  return result

do =>
  {
    argv
  } = process

  env_li = argv.slice(2)
  if not env_li.length
    console.error '''
expand env file
USAGE: ''' + basename(argv.at(-1)) + ' a.env b.env ...'
    process.exit(1)

  env = env_li.map (fp)=>
    read fp

  { processEnv } = expand({
    parsed: parse env.join('\n')
    processEnv: {}
  })

  console.log stringify(processEnv)
  return
