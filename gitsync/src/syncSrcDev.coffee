> ./mergeIfNeed.js
  @3-/int

###
同步规则
超过 dev 分支超过10天没有新的commit,并且上次同步<最后一次commit时间，自动同步 dev
有新的提交 git clone 检查是否需要同步
  如果同步 更新hash 和 同步时间
  否则 更新hash 不更新时间
###

DAY = 864e2

export default (
  src
  src_org
  is_private
  exist
  args
)=>
  [
    name
    db
    now
    to
    to_org
  ] = args

  try
    dev = await src.branch(src_org, name, 'dev')
  catch err
    if err.status == 400
      return
    console.error err
    return

  if not dev
    return

  { commit } = dev

  commit_ts = int(new Date(commit.authored_date)/1e3)

  { id:sha } = commit

  args.push(
    src.gitUrl src_org, name
    commit_ts
    sha
  )

  if exist.has(name)
    pre = db[name]
    if pre
      [pre_check_sha, pre_sync_ts] = pre
      if pre_check_sha == sha
        if not pre_sync_ts
          pre[1] = now

        expire = int (now - commit_ts)/DAY
        console.log name, '距离上次同步', expire, '天'
        if pre_sync_ts < commit_ts and expire > 9
          args.push true
        else
          return
  else
    await to.reposNew(to_org, name, is_private)

  return mergeIfNeed ...args
