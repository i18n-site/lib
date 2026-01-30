#!/usr/bin/env coffee

> ./fmtSeg.js
  ./fmtJsonMd.js

export default (chat, pli)=>
  fmtJsonMd(
    await Promise.all pli.map ([title,li])=>
      console.log '\n---\n→ '+title+'\n'+li.join('\n')+'\n---\n'
      [
        title
        await fmtSeg(chat, li.join('\n'))
      ]
  )
