> ./GET.js
  ./HEAD.js
  @3-/cw/Res.js
  # ./init.js

METHOD = HEAD {
  # POST: ({url},env)=>
  # {pathname} = new URL(url)
  # url = env.B2_URL+pathname
  # return fetch(url)
  GET
}

fetch = (req, env, ctx) =>
  func = METHOD[req.method]
  if func
    try
      r = await func(req,env,ctx)
    catch e
      if e instanceof Response
        return e
      console.error(e)
      if e instanceof Error
        e = e.toString()
      else if e?.constructor == String
        return Res 200, e
      else
        e = JSON.stringify(e)
      return Res 500, e
    if r != undefined
      if r.constructor == String
        return new Response(r)
      return r
  return Res 404,'Not found'

export default {
  fetch
}

# DEFAULT = {
#   fetch:(args...)=>
#     init(...args)
#     DEFAULT.fetch = fetch
#     fetch(...args)
# }

# export default DEFAULT

