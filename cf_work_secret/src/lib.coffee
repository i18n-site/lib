> ./envhash.js
  ./cf.js

export default (
  cf_env
  fp
)=>
  t = envhash(fp)
  if t
    [env, save] = t
    await cf cf_env,env
    save()
  return
