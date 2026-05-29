#!/usr/bin/env coffee

import gitapi from '@3-/gitapi'
 const { GITHUB_TOKEN, ATOMGIT_TOKEN } = process.env;

const github = gitapi('api.github.com', GITHUB_TOKEN),
  atomgit = gitapi('api.atomgit.com', ATOMGIT_TOKEN),
  orgReposLs = async (api, org) => {
    for await (const i of api.orgRepos(org)) {
      console.log(api.site, i.full_name)
    }
  }

await orgReposLs(atomgit,'js0')
await orgReposLs(github,'js0-site')
