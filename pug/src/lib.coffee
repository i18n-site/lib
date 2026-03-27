> @3-/write
  @3-/merge

import {resolve, dirname, basename, join} from 'path'
import {existsSync, mkdirSync, unlinkSync, readFileSync, readdirSync, statSync} from 'fs'
import { renderFile } from 'pug'
import fmtErr from './fmtErr.js'
import { cwd, env } from 'node:process'


CONF = join(cwd(),'conf/pug', env.NODE_ENV or 'development')

loadVar = (fp)=>
  if existsSync(fp)
    return  (
      await import(
        fp
      )
    ).default
  return {}

VAR = await loadVar(CONF+'.js')

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
  relname = relpath.slice(0, -4)
  html_fp = join(outdir, relname + HTML)
  try
    html = renderFile(
      fp
      merge(
        await loadVar(
          join(CONF, relname+'.js')
        )
        VAR
      )
    )
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
      await _renderDir(fp, outdir, basedir)
    else
      await renderPug(basedir, outdir, fp)
  return

export renderDir = (srcdir, outdir) =>
  _renderDir(srcdir, outdir, srcdir)
