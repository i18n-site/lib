#!/usr/bin/env coffee

> @3-/jsext/jsext.js
  fs > existsSync readFileSync
  path > dirname normalize extname join resolve:resolvePath
  process > cwd
  url > fileURLToPath pathToFileURL
  coffeescript:CoffeeScript
  @3-/coffee_plus

compile = CoffeePlus(CoffeeScript)

baseURL = pathToFileURL("#{cwd}/").href

not_coffee = (specifier)=>
  specifier.slice(specifier.lastIndexOf(".") + 1) != 'coffee'

export resolve = (specifier, context, defaultResolve) =>
  { parentURL = baseURL } = context

  if not_coffee(specifier)
    :$
      loop
        if parentURL.startsWith('file://')
          for prefix from ['./','../']
            if specifier.startsWith prefix
              file = specifier+'.coffee'
              fp = normalize join dirname(parentURL[7..]),file
              if existsSync fp
                specifier = fp
                break $
        return jsext(specifier,context,defaultResolve)

  {
    shortCircuit: true,
    url: new URL(specifier, parentURL).href
  }


COMMONJS = {
  format:'commonjs'
  shortCircuit:true
}

export load = (url, context, defaultLoad)=>
  if url.endsWith('.node')
    return COMMONJS

  if not_coffee(url)
    return defaultLoad(url, context, defaultLoad)
  format = getPackageType(fileURLToPath url)
  if format == "commonjs"
    return COMMONJS

  { source: rawSource } = await defaultLoad(url, { format })
  transformedSource = compile(rawSource.toString(), {
    bare: true,
    filename: url,
    inlineMap: true,
  })

  return {
    format
    shortCircuit: true
    source: transformedSource,
  }

getPackageType = (url) =>
  isFilePath = ["js", "mjs", "coffee"].includes(extname(url)[1..])
  dir = if isFilePath then dirname(url) else url
  packagePath = resolvePath(dir, "package.json")
  try
    {type} = JSON.parse readFileSync(packagePath, { encoding: "utf8" })
  catch err
    if err?.code != "ENOENT"
      console.error(err)
  if type
    return type
  return dir.length > 1 and getPackageType(resolvePath(dir, ".."))
