export default (
  git
  raw
  name
  from_git
  to_git
  pre_sync_sha
)=>
  await git.init()
  await git.addRemote('origin', to_git)
  await git.addRemote('src', from_git)

  if pre_sync_sha
    try
      await raw('fetch --depth=1 src', pre_sync_sha)
      await git.checkout('FETCH_HEAD')
      since = '--shallow-since="' + (await raw 'show -s --format=%ci') + '"'
    catch
      #
  fetch = (...args)=>
    if since
      args.push(since)
    console.log 'git fetch',...args
    git.fetch args

  await fetch 'src', 'dev'
  await fetch 'src', 'main'
  try
    await fetch 'origin', 'main'
    # await new Promise(=>)
  catch err
    if err.message.includes('couldn\'t find remote ref main')
      console.log 'init', to_git
      await raw 'checkout -b src src/main'
      init = await git.firstCommit()
      await raw(
        'push origin', init+':refs/heads/main', '-f'
      )
      await fetch('origin main')
    else
      console.error err
  await raw 'checkout -b main origin/main'
  try
    await raw 'merge --ff --no-edit src/main'
  catch err
    if err.message.includes(
      'refusing to merge unrelated histories'
    )
      console.warn '⚠️', to_git, err.message
      tag = 'bak.'+(new Date).toISOString().slice(0,19).replaceAll(':','-').replace('T','_')
      await git.addTag(tag)
      await git.push('origin', tag)
      await raw 'reset --hard src/main'
      await raw 'push origin HEAD:main --force'
    else
      throw err
  return
