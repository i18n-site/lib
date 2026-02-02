#!/usr/bin/env coffee

> @3-/read
  @3-/write
  @3-/walk > walkRel
  path > join dirname
  svgo > loadConfig optimize

PWD = import.meta.dirname
ROOT = process.cwd()

conf = await loadConfig(
  join PWD, 'svgo.config.cjs'
)

SVG = join(
  ROOT
  'svg'
)

export default svg2css = =>
  out = [
    ":root{"
  ]

  for await fp from walkRel SVG
    if not fp.endsWith('.svg')
      continue
    console.log fp
    svg_fp = join SVG, fp
    s = read svg_fp
    svg = optimize(
      s.trim().replaceAll('class="icon"','')
    ).data
    if svg != s
      write(
        svg_fp
        svg
      )
    name = fp.charAt(0).toUpperCase() + fp.slice(1,-4)
    out.push """--svg#{name}:url('data:image/svg+xml;utf8,#{svg.replaceAll('#','%23')}');"""
  out.push '}'

  return out.join('')


write(
  join ROOT,'svg.css'
  await svg2css()
)
