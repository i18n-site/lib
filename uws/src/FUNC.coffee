> @3-/utf8/utf8d.js

body = (req)=>
  li = []
  new Promise(
    (resolve, reject)=>
      req.onData (
        (chunk,last)=>
          li.push Buffer.from chunk
          if last
            resolve (
              Buffer.concat li
            )
          return
      )
      return
  )

txt = (req)=>
  utf8d await body(req)

export default {
  head:->
    r = {}
    @req.forEach (k,v)=>
      r[k] = v
    r
  head_li:->
    r = []
    @req.forEach (k,v)=>
      r.push [k,v]
    r
  body:->
    body(@res)
  txt:->
    txt(@res)
  json:->
    JSON.parse await txt(@res)
}
