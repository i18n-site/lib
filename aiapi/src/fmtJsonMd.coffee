#!/usr/bin/env coffee

>  @3-/txt_li
  ./refmt.js

txtFmt = (txt)=>
  TxtLi(txt).join('\n\n')

export default (
  user
  title_json_li
)=>

  userName = (label, n)=>
    t = user[n-1]
    if t
      {
        name
      } = t
    else
      name = label
    return '**<u>'+name+'</u>:** '

  md_li = []
  for [title,li] from title_json_li
    md_li.push '## '+title
    for {题,问,答,回答者,提问者} from li
      答 = txtFmt(答).trim()
      if (答.startsWith '1. ') or 答.endsWith(':') or 答.endsWith('：')
        答 = '\n'+答
      md_li.push '### '+ 题 + '\n' + userName('问',提问者) + txtFmt(问).trimEnd() + '\n\n' + userName('答',回答者) + 答 + '\n'

  md_li.map(
    refmt
  ).join('\n')
