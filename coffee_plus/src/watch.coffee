> chokidar
  @3-/write
  @3-/read
  path > dirname join relative extname
  fs > mkdirSync copyFileSync unlinkSync existsSync
  ./compile.js
  ./run.js

export default (srcdir, outdir, sh)=>
  if sh
    [
      restart
      kill
    ] = run(sh)

  watcher = chokidar.watch srcdir,
    ignored: /(^|\/)\../
    persistent: true

  watcher.on 'all', (event, fp) ->
    rfp = relative srcdir, fp
    ext = extname(fp)
    is_coffee = ext == '.coffee'

    ofp = join outdir, rfp
    if is_coffee
      ofp = ofp.slice(0, -6)+'js'

    switch event
      when 'unlink'
        if existsSync ofp
          console.log 'rm '+rfp
          unlinkSync ofp
        # restart?()
      when 'add', 'change'
        if is_coffee
          try
            js = compile(
              read(fp)
              {
                noHeader:true
                bare:true
              }
            )
            write(ofp, js)
            console.log rfp
          catch e
            console.error(
              rfp+'\n❌ '+e.toString()
            )
            return
        else
          target_dir = dirname ofp
          mkdirSync target_dir, recursive: true
          copyFileSync fp, ofp
        restart?(ofp)
    return

  process.stdin.resume()

  process.on('SIGINT'
    =>
      kill?()
      watcher.close()
      process.exit()
      return
  )

  return
