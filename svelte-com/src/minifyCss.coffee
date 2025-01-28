#!/usr/bin/env coffee

import browserslist from 'browserslist'
import { red, gray, green, bgRed, white } from 'ansis'
import { styleText } from 'node:util'
import { transform, browserslistToTargets, Features } from 'lightningcss'

targets = browserslistToTargets browserslist('> 3%')

fmtErr = ({fileName, source, loc: {line, column}, data: {type: errorType}}) =>
  lines = source.split('\n')
  startLine = Math.max(1, line - 3)
  endLine = Math.min(lines.length, line + 3)

  li = (
    for lineNumber in [startLine..endLine]
      lineContent = lines[lineNumber - 1]
      gray(lineNumber + ' ') + (
        if lineNumber == line
          beforeError = red lineContent[0...column-1]
          afterError = red lineContent[column...]
          errorCharFormatted = bgRed lineContent[column-1] or ''
          errorLineFormatted = "#{beforeError}#{errorCharFormatted}#{afterError}"
          errorLineFormatted
        else
          gray lineContent
      )
  )


  """
  #{green(fileName)} #{gray(':')} #{red errorType}
  #{li.join('\n')}
  """

export default minify = (css, filename)=>
  try
    r = transform({
      filename # 可选，用于错误信息
      code: Buffer.from(css),
      minify: true
      sourceMap: false
      targets
      outputStyle: 'expanded'
    })
  catch e
    if e?.loc
      e = fmtErr e
    console.error e
    return

  if r.warnings.length
    if filename
      console.warn filename
    for i from r.warnings
      console.warn i

  r

# console.log minify('''
# .x {
#   background-color: #f;
# }
# .xx{color:#ff0000;
# }''','xx.css')
