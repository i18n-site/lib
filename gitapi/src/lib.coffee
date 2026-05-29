> @3-/pageiter

# < ATOMGIT = 'api.atomgit.com/'
# < GITHUB = 'https://api.github.com/'

< (site, token)=>

  base = 'https://' + site + '/'

  authorization = 'Bearer '+token

  req = (url, option={})=>
    headers = option.headers
    if not headers
      option.headers = headers = {}
    headers.Authorization = authorization
    r = await fetch(
      base+url
      option
    )
    if r.status < 200 or r.status > 299
      throw r
    return await r.json()

  post = (url, body)=>
    req(
      url
      {
        method: 'POST'
        body: JSON.stringify(body)
      }
    )

  end = site.indexOf('/')
  git_url_prefix = 'git@'+site.slice(
    site.indexOf('.')+1
    if end<0 then undefined else end
  )+':'

  {
    site

    gitUrl: (org, repo)=>
      git_url_prefix + org + '/' + repo + '.git'

    reposNew: (org, name, is_private)=>
      post(
        "orgs/#{org}/repos"
        {
          name
          private: is_private
        }
      )

    branch: (org, repo, branch)=>
      try
        return await req(
          'repos/'+org+'/'+repo+'/branches/'+branch
        )
      catch e
        if e.status == 404
          return
        throw e

      return

    orgRepos : (org)->
      pageiter (page)=>
        req(
          'orgs/'+org+'/repos?page='+page
        )
  }
