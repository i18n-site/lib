#!/usr/bin/env coffee

> ./fmtSeg.js
  ./partition.js

export default (chat, txt)=>
  if not txt
    return []
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
