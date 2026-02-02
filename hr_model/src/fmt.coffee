#!/usr/bin/env bun

< (li)=>
  r = []
  for [kind, txt] from li
    r.push '# '+kind.join(' / ') + '\n\n' + txt.join('\n')
  r.join('\n\n')
