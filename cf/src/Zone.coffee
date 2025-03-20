> ./index.js:Cf

< (id)=>
  new Proxy(
    {}
    get:(_,prefix)=>
      new Proxy(
        {}
        get: (_,name)=>
          (value)=>
            console.log prefix+'/'+name,value

            if [String,Number,Boolean].includes value.constructor
              value = {value}
            r = await Cf.PATCH([id,prefix,name].join('/'),value)
            # if r.value != value
            #   throw r
            return
      )
  )
