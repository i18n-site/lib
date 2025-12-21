> ./needSync.js
  ./gitInit.js
  ./merge.js
  fs > rmSync
  @3-/mktmp
  simple-git:Git

sync = (
  tmp
  name
  db
  now
  to
  to_org
  src_git
  commit_ts
  dev_sha
  expire_async
)=>
  console.log name, tmp

  git = Git(tmp)
  raw = (args...)=>
    li = []
    for i from args
      for j from i.split(' ')
        li.push j
    console.log 'git '+li.join(' ')
    r = await git.raw li
    r.trimEnd()

  pre = db[name]
  if not pre
    db[name] = pre = []
    pre[1] = commit_ts - 1

  pre_sync_sha = pre[2]

  await gitInit(
    git
    raw
    name
    src_git
    to.gitUrl to_org, name
    pre_sync_sha
  )

  if not expire_async
    need_sync = await needSync raw

  if expire_async or need_sync
    await merge(tmp, db, name, raw, dev_sha, ...(need_sync or []))
  else
    pre[0] = dev_sha
  return 1

export default (name, args...)=>
  tmp = mktmp(name)
  try
    return await sync tmp, name, ...args
  finally
    # rmSync(tmp, {recursive: true, force: true})

  return
