> @swc/core:swc
  @3-/merge

< (js, filename, option)=>
  swc.transform(
    js
    merge(
      {
        filename
        sourceMaps:true
        jsc: {
          minify: {
            compress: {
              unused: true
              drop_console: true
              drop_debugger: true
            }
            mangle: true
          }
        }
        minify: true
        env:
          targets: "> 1%"
      }
      option
    )
  )
