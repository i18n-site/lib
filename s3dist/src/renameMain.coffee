> @3-/b64/uB64e.js
  @3-/read
  @3-/write
  @3-/ext
  path > join
  fs > existsSync unlinkSync
  esbuild
  ./REPLACE_EXT.js
  @3-/blake > blake3Hash

DEP='__vite__fileDeps'

js_css = (code)=>
  # viteFileDeps
  p = code.indexOf(DEP)
  css_li = []
  if p > 0
    begin = code.indexOf('[',p)
    if begin > 0
      end = code.indexOf(']',begin)
      li = JSON.parse code.slice(begin,end+1)
      for i from li
        if i.endsWith('.css')
          css_li.push i

  if css_li.length
    css_li = JSON.stringify css_li
    code = code.replace(
      /(\w+)\.endsWith\("\.css"\)/
      (n, varname)=>
        "#{css_li}.includes(#{varname}.split('/').pop())"
    )
  else
    console.error DEP+' not exist'
    process.exit(1)
  code

< (dir, file_li)=>
  main_js = 'main.js'
  main_fp = join(dir, main_js)
  if not existsSync main_fp
    return
  main = js_css read main_fp

  new_name = uB64e(blake3Hash(main))+'.js'

  {
    code
  } = await esbuild.transform(main, {
    minify:true
  })

  file_li.splice file_li.indexOf(main_js),1
  for i from file_li
    if REPLACE_EXT.includes(ext(i))
      fp = join(dir,i)
      t = read(fp)
      t2 = t.replaceAll('/'+main_js,'/'+new_name)
      if t2 != t
        write(
          fp
          t2
        )

  file_li.push new_name
  write(
    join dir, new_name
    code
  )
  unlinkSync main_fp
  return
