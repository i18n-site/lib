> @3-/yml/tryLoad.js
  @3-/yml/dump.js
  @3-/int
  ./syncSrcDev.js

getName = (git_url) =>
  p = git_url.lastIndexOf('/')
  name = git_url.slice(p+1)
  if name.endsWith '.git'
    name = name.slice(0, -4)
  return name


export default (
  db_yml # name : [ pre_check_sha , pre_sync_ts, pre_sync_sha ]
  src, src_org, to, to_org
) =>
  db = tryLoad(db_yml) or {}
  exist = new Map
  for await {git_url} from to.orgRepos to_org
    exist.set(
      getName(git_url)
      git_url
    )

  err_num = 0
  changed = 0
  now = int new Date / 1e3

  task = (meta)=>
    src_git = 'git@gitcode.com:' + meta.full_name.replace(' / ','/')
    name = getName(src_git)
    try
      if await syncSrcDev(
        src
        src_org
        meta.private
        exist
        [
          name
          db
          now
          to
          to_org
        ]
      )
        ++changed
    catch e
      ++err_num
      console.error src_git, e
    return

  for await i from src.orgRepos src_org
    try
      await task i
    catch e
      console.error i.git_url, e

  if changed
    console.log 'save', db_yml
    dump(db_yml, db)
  return err_num
