> fs > existsSync

JS_SUFFIX = '.js'

BUILDIN = new Set ['fs','stream','zx','assert']
{
  NODE_PATH
} = process.env

if NODE_PATH
  NODE_PATH = NODE_PATH.replaceAll(';').split(':')
else
  NODE_PATH = []

export default (specifier,cx,defaultResolve)=>
  {parentURL} = cx
  if not specifier.includes ':'
    if not parentURL.includes '/node_modules/'
      li = specifier.split '/'
      if li.length
        if not BUILDIN.has li[0]
          if specifier.startsWith '@'
            begin = specifier.indexOf('/',1)+1
          else
            begin = 1

          pos = specifier.indexOf('/',begin)
          if pos > 0 and not li.pop().includes('.')
            specifier += JS_SUFFIX

  try
    return await defaultResolve(specifier, cx)
  catch err
    if not specifier.startsWith('.')
      for i from NODE_PATH
        cx.parentURL = 'file://'+i
        try
          return await defaultResolve(specifier,cx)
        catch
          continue
  throw err
  return
