#!/usr/bin/env coffee

> @3-/uridir
  @3-/read
  @3-/write
  fs > existsSync
  path > join dirname

ROOT = uridir(import.meta)
main = =>
  pkg_js = join ROOT,'pkg/_.js'
  index = read pkg_js
  if ~ index.indexOf('import.meta.url')
    return

  li = index.replaceAll(
    'module.exports.','export const '
  ).trimEnd().split('\n')

  # for i,pos in li
  #   if i.startsWith 'const {'
  #     p = i.indexOf('require(')
  #     if p > 0
  #       i = i.trimEnd()
  #       li[pos] = 'import '+i.slice(6,-1).replace(/\s*=\s*/g,' from ').replace('require(','')
  #
  # li = li.join('\n')
  # p = li.lastIndexOf('const ')
  # if p > 0
  #   t = li.slice(p)
  #   li = li.slice(0,p)
  #   p = t.lastIndexOf('}')
  #   end = t.slice(p)
  #   export_li = t.slice(t.indexOf('{')+1,p).split(',').map((i)=>i.trim())
  #
  out = '''import { createRequire } from "module";
  import { dirname, sep } from "path";
  const __dirname = dirname(decodeURIComponent(import.meta.url.slice(sep=='/'? 7:8)));
  const require = createRequire(import.meta.url);''' +li.join('\n')
  #
  # patch_fp = join ROOT, 'patch.js'
  #
  # if existsSync patch_fp
  #   patch = read(patch_fp)
  #   out += ';\n'+patch
  # else
  #   patch = ''
  #
  # if export_li
  #   for i from export_li
  #     out+='\nexport const '+i+' = nativeBinding.'+i+';'
  #
  write(
    pkg_js
    out
  )
  return

main()
