> chokidar
  @3-/write
  @3-/read
  path > dirname join relative extname
  fs > mkdirSync copyFileSync unlinkSync
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

    switch event
      when 'unlink'
        target_path = join outdir, rfp
        unlinkSync target_path
        # restart?()
      when 'add', 'change'
        ext = extname(fp)
        ofp = join outdir, rfp
        if ext == '.coffee'
          try
            js = compile(
              read(
                fp
              )
              {
                noHeader:true
                bare:true
              }
            )
            ofp = ofp.slice(0, -6)+'js'
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
