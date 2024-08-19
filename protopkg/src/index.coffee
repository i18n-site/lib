> @3-/protojs
  @3-/split
  @3-/write
  @3-/read
  @3-/nt/load.js
  fs > existsSync readdirSync
  path > basename join dirname

import_map = {
  S:'import S from \'~/lib/S.js\''
  C:'import C from \'@8p/captcha\''
}

gen = (mod, dir, proto, to)=>
  api = join dir, 'api.nt'

  noarg = {C:[],S:[]}

  if existsSync api
    api = load api
    import_set = new Set
    li = Object.entries(api)
    if li.length
      kind_set = new Set
      t = []
      for [url, args] from li

        p = args.lastIndexOf('→')
        return_type = args.slice(p+1)
        args = args.slice(0,p)
        prefix = '🚧 '
        has_captcha = args.startsWith prefix
        if has_captcha
          args = args.slice(prefix.length)
          call = 'C'
        else
          call = 'S'
        import_set.add call
        kind_li = args.split ';'

        args = []
        kind_li = kind_li.map(
          (i)=>
            [name, type] = split(i,':')
            args.push name
            " * @param {#{type}} #{name}"
        ).join('\n')

        args = args.join(',')
        fetch = call+".#{url}(#{args})"

        return_type_is_empty = return_type == '()'
        if return_type_is_empty
          async = ""
        else
          kind_set.add return_type
          fetch = "_#{return_type}(await #{fetch})"
          async = "async "

        if args.length == 0 and return_type_is_empty
          noarg[call].push url
        else
          if args.length
            t.push '/**\n'+kind_li+'\n*/'
          export_name = 'const '+url+' ='
          t.push "export #{export_name} #{async}(#{args})=>#{fetch}\n"

      if kind_set.size
        t.unshift "import {#{[...kind_set].map((i)=>"#{i} as _#{i}").join(',')}} from './proto.js'"

      for i from import_set
        t.unshift import_map[i]

      for [k,v] from Object.entries noarg
        if v.length
          t.push "export const {#{v.join(',')}} = #{k}"

      write(
        join to,mod,'index.js'
        t.join('\n')
      )

    d = join to, mod
    write(
      join d,'proto.js'
      await protojs proto
    )
    write(
      join d, 'README.md'
      """
```proto
#{read(proto).trim()}
```
      """
    )
    pkgjson = join d, 'package.json'
    if not existsSync pkgjson
      write(
        pkgjson
        """
{
"name": "@5-/#{mod}",
"version": "0.1.0",
"repository": "https://github.com/3TiSite/proto.git",
"homepage": "https://github.com/3TiSite/proto/tree/main/#{mod}",
"author": "i18n.site@gmail.com",
"license": "Apache-2.0",
"exports": {
  ".": "./index.js",
  "./*": "./*"
},
"peerDependencies": {
  "@3-/proto": "^2.0.43"
  #{if import_set.has('C') then ',"@8p/captcha": "^0.3.2"' else ''}
},
"type": "module"
}"""
    )
  return

dirgen = (mod, d, to)=>
  proto = join d, 'api.proto'
  if existsSync proto
    await gen(
      mod
      d
      proto
      to
    )
  return

< (root, to)=>
  if existsSync join(root,'Cargo.toml')
    await dirgen dirname(root),root,to
    return
  for dir from readdirSync(root)
    if dir.startsWith '.'
      continue
    dir = join root, dir
    for i from readdirSync(dir)
      if i.startsWith '.'
        continue
      await dirgen i, join(dir, i), to
  return
