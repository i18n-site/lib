> dotenv > parse
  @3-/write

import {resolve, dirname, basename, join} from 'path'
import {existsSync, mkdirSync, unlinkSync, readFileSync, readdirSync, statSync} from 'fs'
import { watch } from 'chokidar'
import { renderFile } from 'pug'
import fmtErr from './fmtErr.js'
import { cwd, env } from 'node:process'
import read from '@3-/read'

ENV = {}

do =>
  load = (name)=>
    fp = join(cwd(),'conf',name+'.env')
    if existsSync(fp)
      Object.assign ENV, parse read fp
    return

  { NODE_ENV } = env
  if NODE_ENV
    load(NODE_ENV)

  load 'pug'
  return

UTF_8 = 'utf-8'
HTML = '.html'

export ensureDir = (dir) =>
  if not existsSync(dir)
    mkdirSync(dir, { recursive: true })
  return

export rmHtml = (basedir, outdir, fp) =>
  relpath = fp.slice(basedir.length + 1)
  html_fp = join(outdir, relpath.slice(0, -4) + HTML)
  if existsSync(html_fp)
    unlinkSync(html_fp)
    console.log 'rm '+relpath
  return

export renderPug = (basedir, outdir, fp) =>
  if not fp.endsWith('.pug')
    return

  if '._'.includes basename(fp)[0]
    return

  relpath = fp.slice(basedir.length + 1)
  html_fp = join(outdir, relpath.slice(0, -4) + HTML)
  try
    html = renderFile(fp, ENV)
    console.log relpath
  catch err
    if err?.filename
      err = fmtErr(err)
    else
      console.error relpath
    console.error err
    return
  write(html_fp, html, UTF_8, (err) => { })
  return

_renderDir = (dir, outdir, basedir) =>
  files = readdirSync(dir)
  for file in files
    fp = join(dir, file)
    stats = statSync(fp)
    if stats.isDirectory()
      _renderDir(fp, outdir, basedir)
    else
      renderPug(basedir, outdir, fp)
  return

export renderDir = (srcdir, outdir) =>
  _renderDir(srcdir, outdir, srcdir)
  return

export watchDir = (srcdir, outdir) =>
  watcher = watch(srcdir, { ignored: /(^|[\/\\])\../, persistent: true })
  _render = renderPug.bind(null, srcdir, outdir)
  watcher.on('add',_render)
  watcher.on('change',_render)
  watcher.on('unlink', (fp)=>rmHtml(srcdir, outdir, fp))
  return
