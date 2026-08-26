> postgres
  lodash-es/merge.js

< (url, opt)=>
  postgres(
    url
    merge(
      # debug: console.log
      types:
        bigint:
          to: 20,
          from: [20],
          parse: (x) => +x
          serialize: (x) => x.toString()
      opt or {}
    )
  )
