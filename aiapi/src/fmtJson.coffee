#!/usr/bin/env coffee

> ./fmtSeg.js
  ./partition.js
  @3-/rm_cn_space

export default (chat, txt)=>
  if not txt
    return []
  txt = RmCnSpace txt
  pli = await partition(
    chat
    txt
  )
  return Promise.all pli.map ([title,li])=>
    console.log '\n---\n→ '+title+'\n'+li.join('\n')+'\n---\n'
    [
      title
      await fmtSeg(chat, li.join('\n'))
    ]
