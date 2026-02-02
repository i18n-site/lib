#!/usr/bin/env coffee

> chokidar > watch
  ./lib.js > rmHtml renderPug

< (srcdir, outdir) =>
  watcher = watch(srcdir, { ignored: /(^|[\/\\])\../, persistent: true })
  _render = renderPug.bind(null, srcdir, outdir)
  watcher.on('add',_render)
  watcher.on('change',_render)
  watcher.on('unlink', (fp)=>rmHtml(srcdir, outdir, fp))
  return
