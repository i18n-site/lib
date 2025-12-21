> path > dirname
  fs > writeFileSync mkdirSync

< (fp, txt)=>
  mkdirSync dirname(fp), recursive: true
  writeFileSync fp, txt
  return
