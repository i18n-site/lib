#!/usr/bin/env coffee

> @3-/gitsync
  @3-/req/reqTxt.js
  path > join
  zx/globals:

$.verbose = true

{
  GITHUB_TOKEN
  ATOMGIT_TOKEN
} = process.env

atomgit = gitsync 'api.atomgit.com', ATOMGIT_TOKEN
github = gitsync 'api.github.com', GITHUB_TOKEN

ROOT = "/Users/z/js0"

syncGitLi = (name, git_li)=>
  if git_li.length < 2
    return
  git = git_li.pop()
  console.log git
  if git.startsWith 'git://github.com'
    git = 'ssh://git@ssh.github.com:443'+git.slice(16)

  cd ROOT
  await $"git clone -b dev --depth=1 #{git} #{name}"
  cd join(ROOT,name)
  await $'reset_git'
  for i from git_li
    await $"git remote set-url origin #{i} && git push origin --delete dev; git checkout main && git push -f && git checkout dev && git push -f"
  return

syncOrg = (api_org_li)=>
  name2git = new Map

  for [api, org] from api_org_li
    for await i from api.orgRepos org
      {
        git_url
      } = i
      name = i.full_name.split('/')[1]
      t = name2git.get name
      if t
        t.push git_url
      else
        name2git.set name, [git_url]

  for [name, git_li] from name2git.entries()
    console.log name
    await syncGitLi(name, git_li)
  return

await syncOrg [
  [
    atomgit
    # 'js0'
  ]
  [
    github
    # 'js0-site'
  ]
]

# PUBLIC = 20
# PRIVATE = 0
# ATOM_COOKIE = ''
# atomgitRepoNew = (full_name, is_private)=>
#   reqTxt(
#     'https://atomgit.com/api/v3/projects?_input_charset=utf-8'
#     headers:
#       accept: "application/json, text/javascript"
#       "accept-language": "zh-CN,zh;q=0.9,en;q=0.8"
#       "content-type": "application/json"
#       priority: "u=1, i"
#       "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\""
#       "sec-ch-ua-mobile": "?0"
#       "sec-ch-ua-platform": "\"macOS\""
#       "sec-fetch-dest": "empty"
#       "sec-fetch-mode": "cors"
#       "sec-fetch-site": "same-origin"
#       "x-current-tenant-id": "690b29b7b93d0e9f201c8bcb"
#       "x-requested-with": "XMLHttpRequest"
#       "cookie": ATOM_COOKIE
#     referrer: "https://atomgit.com/project/new"
#     method: "POST"
#     mode: "cors"
#     credentials: "include"
#     body: JSON.stringify(
#       name: full_name
#       path: full_name
#       visibility_level: if is_private then PRIVATE else PUBLIC
#       namespace_id: 1641047
#       is_crypto_enabled: false
#       guarantee_check: ["law", "rights", "legal"]
#       init_standard_service: false
#       open_department_id_paths: []
#       target_org_id: "690b2bb2258f4d1b9e1d98ba"
#     )
#   )

#   url = 'ssh://git@ssh.github.com/js0-site/blog.git'
# {
#   full_name
#   private: is_private
# } = i
# console.log full_name, is_private
# try
#   await atomgitRepoNew full_name.split('/').pop(), is_private
# catch err
#   console.log err
# break
