> @3-/fastly > purge:_purge

export purge = (env, pkg)=>
  {
    FASTLY_TOKEN
    FASTLY_HOST
  } = env
  _purge(
    FASTLY_TOKEN
    FASTLY_HOST
    pkg
  )

