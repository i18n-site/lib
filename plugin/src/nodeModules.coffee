#!/usr/bin/env coffee
> @3-/deps
  @3-/read
  fs > existsSync readdirSync rmSync symlinkSync lstatSync readlinkSync
  path > join dirname relative basename sep


package_json = 'package.json'

export default (ROOT, file_li)->
  node_modules = join ROOT,'node_modules'
  for i from readdirSync node_modules
    if i == '~'
      continue
    if i.startsWith '@'
      root = join(node_modules,i)
      for j in readdirSync root
        for file from file_li
          if existsSync join(root, j, file)
            yield i + '/' + j + '/' + file
      continue
    if not i.startsWith '.'
      for file from file_li
        if existsSync join(node_modules, i, file)
          yield i + '/' + file
  return
  # r = []
  # exist = new Set
  # for i from deps(ROOT)
  #   fp = join(node_modules,i,file)
  #   if existsSync fp
  #     exist.add i
  #     r.push i
  #
  # pnpm = join node_modules,'.pnpm'
  #
  # submod = (pkg)=>
  #   {name} = JSON.parse read pkg
  #   if exist.has name
  #     return
  #   exist.add name
  #   d = dirname(pkg)
  #   if existsSync join d,file
  #     r.push name
  #     d = d.slice(node_modules.length+1)
  #     nmdir = sep+'node_modules'+sep
  #     p = d.indexOf(nmdir)
  #     to = join node_modules, d.slice(p+nmdir.length)
  #     pkg_dir = dirname(pkg)
  #     rel = relative(to, pkg_dir).slice(3)
  #     if existsSync to
  #       if lstatSync(to).isSymbolicLink()
  #         if rel == readlinkSync(to)
  #           return
  #       rmSync(to, { recursive: true, force: true })
  #     process.chdir dirname to
  #     symlinkSync rel, basename(to)
  #   return
  #
  # for i from readdirSync pnpm
  #   nm = join pnpm, i, 'node_modules'
  #   if existsSync nm
  #     for j from readdirSync nm
  #       d = join nm,j
  #       pkg = join d,package_json
  #       if existsSync pkg
  #         submod pkg
  #         continue
  #       for k from readdirSync d
  #         pkg = join d,k,package_json
  #         if existsSync pkg
  #           submod pkg
  # return r
