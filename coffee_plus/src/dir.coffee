#!/usr/bin/env coffee

> @3-/walk > walkRel
  @3-/write
  fs > readFileSync statSync constants chmodSync rmSync copyFileSync mkdirSync
  path > join dirname basename
  fs-extra:fsExtra
  ./compile.js

{ copySync } = fsExtra

< (src, outdir, ext='js')=>
  ext = '.'+ext
  out = (dir, filedir, fp)=>
    cfp = join(filedir,fp)
    cf = readFileSync cfp,'utf8'
    if fp.endsWith '.coffee'
      fp = fp[..-8]
    ofp = join(dir,fp+ext)

    console.log ofp

    write ofp,compile(
      cf
      {noHeader:true,bare:true}
    )

    if (statSync cfp).mode & constants.S_IXUSR
      chmodSync(ofp, 0o755)
    return

  if statSync(src).isDirectory()
    if outdir
      out_not_src = outdir != src
    else
      outdir = src
      out_not_src = 0
    for await fp from walkRel(
      src
      (i)=>
        if i.endsWith("/.git")
          return true
        if i.endsWith("/node_modules")
          o = join(outdir, i)
          rmSync(o, { force: true, recursive: true })
          copySync(join(src, i), o, {
            overwrite: true,
          })
          return true
        return
    )
      if fp.endsWith '.coffee'
        out(outdir, src, fp)
      else if out_not_src
        ofp = join(outdir, fp)
        mkdirSync dirname(ofp), { recursive: true }
        copyFileSync join(src, fp), ofp
  else
    filedir = dirname(src)
    if not outdir
      outdir = filedir
    out(outdir, filedir, basename(src))
  return
