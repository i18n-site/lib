#!/usr/bin/env coffee

> path > join
  @3-/read

< (root)=>
  {
    devDependencies
    dependencies
  } = JSON.parse read(
    join root,'package.json'
  )
  node_modules = []
  for pkg from [
    dependencies
    devDependencies
  ]
    if pkg
      node_modules.push ... Object.keys(pkg)
  node_modules
