import { green, red, bgWhite, gray, bold, reset } from 'ansis'
import { readFileSync } from 'node:fs'

export default (err) =>
  { msg, line, column, filename } = err

  txt_li = readFileSync(filename, 'utf8').split('\n')
  startLine = Math.max(0, line - 4)
  endLine = Math.min(txt_li.length, line + 3)

  li = []
  for i in [startLine...endLine]
    ln = i+1
    txt = txt_li[i]

    if ln == line
      txt = red(
        txt.slice(0,column-1)
      ) + bgWhite.red(txt[column-1]) + red(
        txt.slice(column)
      )

    li.push(
      gray(ln) + ' ' + txt
    )

  [
    green(filename)
    bold(red('ERROR')) + ' ' + msg
    li.join("\n"),
  ].join("\n")


