> @3-/reset
  @3-/int
  path > join
  fs > existsSync
  zx > $

# 非调试不要开，防止git diff的秘钥泄露
# $.verbose = 1
{
  OPENAI_BASE_URL
  OPENAI_MODEL
} = process.env

export default (
  tmp
  db
  name
  git
  dev_sha
  # ./needSync.js return
  base_sha
  to_sha
  commit_msg
)=>
  merge_to = if to_sha then to_sha else 'dev'
  await git 'checkout -b dev src/dev'
  try
    await git 'fetch --deepen=3'
  catch
    await git 'repack -ad'
    await git 'fetch --deepen=3'
  await git 'checkout main'
  await git 'fetch --deepen=3'
  try
    await git 'merge --squash --ff --no-edit', merge_to
  catch
    try
      await git 'fetch --unshallow'
    catch err
      console.error err
    await git 'checkout dev'
    try
      await git 'fetch --unshallow'
    catch err
      console.error err
    await git 'checkout main'
    await git 'merge --squash --ff --no-edit', merge_to
  try
    await git 'checkout --theirs .'
    await git 'add .'
  catch err
    console.error err

  diff = await git 'diff main'
  if diff
    retry = 0
    commit = join tmp, 'commit'

    prompt = '''生成1条英中双语的git commit备注，写入文件 ./commit 。
文风要极简、纯文本，行结尾不加句号，
格式按约定式提交规范，示例如下（如改动不大，就只写一行标题描述；如要写文件改动描述，英文和中文请分开写）：
<type>[optional scope]: <description> / <中文描述>

- change 1 (related files)
- change 2 (related files)

- 改动中文描述1（相关文件）
- 改动中文描述2（相关文件）

---'''

    if commit_msg
      prompt += '\n改动概要:' + commit_msg+'\n---'

    prompt += '\n对照下面代码diff, 翻阅目录下对应源文件理解后再生成 ./commit :\n'+diff

    loop
      try
        await $"cd #{tmp} && qwen -y -p #{prompt}"
      catch err
        if ++retry > 3
          throw err
        console.log retry,err
        continue
      if existsSync(commit)
        await git 'commit --file=commit'
        base_sha = await git 'rev-parse HEAD'
        await git 'push'
        await git 'push src main'
        await git 'checkout dev'
        await git 'fetch src dev'
        await git 'merge --ff --no-edit FETCH_HEAD'
        await git 'merge --ff --no-edit main'
        dev_sha = await git 'rev-parse HEAD'
        await git 'push'
        break
      else
        if ++retry > 9
          throw new Error '❌ ' + name + ': retry too many times'
        console.warn '⚠️ ',OPENAI_BASE_URL,OPENAI_MODEL,name, retry
  reset(
    db[name]
    [
      dev_sha
      int await git 'log -1 --format=%ct'
      base_sha
    ]
  )
  return []
