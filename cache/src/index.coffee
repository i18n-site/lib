> @3-/msgpack/pack.js
  @3-/jsmap > JsMap

AsyncFunction = Object.getPrototypeOf(`async ()=>{}`).constructor

< (func)=>
  cache = new JsMap
  if func instanceof AsyncFunction
    (args...)=>
      key = pack(args)
      if cache.has(key)
        return cache.get key
      r = await func ...args
      cache.set key, r
      r
  else
    (args...)=>
      key = pack(args)
      if cache.has(key)
        return cache.get key
      r = func ...args
      cache.set key, r
      r
