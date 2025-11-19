#!/usr/bin/env coffee

>  @3-/txt_li

txtFmt = (txt)=>
  TxtLi(txt).join('\n\n')

export default (
  title_json_li
)=>
  md_li = []

  for [title,li] from title_json_li
    md_li.push '# '+title
    for {话题,问答} from li
      md_li.push '## ' + 话题
      for {题,问,答} from 问答
        md_li.push '### '+ 题 + '\n问: ' + txtFmt(问)+'\n答: ' + txtFmt(答)

  md_li.join('\n')
