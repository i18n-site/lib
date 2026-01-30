#!/usr/bin/env coffee

>  @3-/txt_li
  ./refmt.js

txtFmt = (txt)=>
  TxtLi(txt).join('\n\n')

export default (
  title_json_li
)=>
  md_li = []

  for [title,li] from title_json_li
    md_li.push '## '+title
    for {题,问,答} from li
      答 = txtFmt(答).trim()
      if (答.startsWith '1. ') or 答.endsWith(':') or 答.endsWith('：')
        答 = '\n'+答
      md_li.push '### '+ 题 + '\n问: ' + txtFmt(问).trimEnd() + '\n\n答: ' + 答 + '\n'

  md_li.map(
    refmt
  ).join('\n')
