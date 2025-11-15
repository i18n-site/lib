> ./Res.js
  @3-/token/decode.js:tokenDecode

export default (func)=>
  (req,env,ctx)=>
    {url, headers} = req
    TOKEN = headers.get('t')
    if not TOKEN
      return Res(
        400
        'headers : miss t:token'
      )
    token = await tokenDecode env.TOKEN_SK, TOKEN
    if not token
      return Res(
        401
        'invalid token'
      )
    return func(req,env,ctx,token)
