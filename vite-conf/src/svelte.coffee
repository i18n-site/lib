> @3-/vite-base/sveltePreprocess.js
  @3-/read
  ./IS_DEV.js
  @3-/coffee_plus
  ansis > greenBright
  path > join dirname
  fs > existsSync
  coffeescript

compile = CoffeePlus(coffeescript)

findRenderWords = (str)=>
  regex = /\b(\w+)\$(\.(render)|$)/g
  matches = []
  while match = regex.exec(str)
    matches.push match[1]
  return matches

IMPORT_onMount = 1
IMPORT_onI18n = 2
IMPORT_sync = 3

IMPORT = {}

IMPORT[IMPORT_onMount] = 'import {onMount} from \'svelte\''
# IMPORT[IMPORT_onI18n] = 'import onI18n from \'@8p/lang/onMount.js\''
IMPORT[IMPORT_onI18n] = 'import onI18n from \'@8p/lang/onMount.js\''
IMPORT[IMPORT_sync] = 'import _syncUnmount from \'@8p/_sync\''

STYLE_CLOSE = '</style>'

tagOpen = new Proxy(
  {}
  get:(_,tag)=>
    begin = '<'+tag
    (line)=>
      if line.startsWith begin
        line = line.slice(begin.length)
        if ' >'.includes line[0]
          if not line.includes('</')
            return true
      return
)

{
  script:isScriptOpen
  template:isTemplateOpen
  style:isStyleOpen
} = tagOpen

asyncUnmount = (txt_li)=>
  li = [txt_li.shift().slice(8)]
  + in_comment
  for line in txt_li
    i = line.trimStart()
    if i == '###'
      in_comment = !in_comment
    if in_comment or i.startsWith('#') or not i
      continue
    if i.length == line.length
      if i == ')'
        li.push ')'
      break
    if i.startsWith '</script>'
      break
    li.push line

  li = li.join('\n')
  code = compile(li, bare:true)
  pos = code.indexOf('()')

  if code.slice(0,pos).endsWith('(async') and code.includes('return ')
    return 1

  return

export svelte = (txt, fp, rfp, i18n)=>
  r = []

  + in_script, in_pug, script_line, in_style, dir

  pug_i18n = new Set
  auto_import = new Set

  txt_li = txt.split '\n'
  for line, pos in txt_li
    if in_style
      if line.startsWith STYLE_CLOSE
        in_style = false
      else
        if IS_DEV and rfp.startsWith 'node_modules/'
          if not dir
            # console.log rfp
            dir = '/@fs/'+dirname(fp)+'/'

          line = line.replace('\'./','\''+dir).replace('"./','"'+dir)
    else if isStyleOpen(line)
      in_style = true
    else if in_script
      if line.startsWith '</script>'
        import_li = []
        for i from auto_import
          import_li.push IMPORT[i]
        if import_li.length
          r[script_line] = r[script_line]+import_li.join(';')
        in_script = false
      else
        for i from findRenderWords(line)
          pug_i18n.add i
        prefix = 'onMount '
        if line.startsWith prefix
          auto_import.add IMPORT_onMount
          if asyncUnmount txt_li.slice(pos)
            auto_import.add IMPORT_sync
            line = prefix+'_syncUnmount '+line.slice(prefix.length)
        if line.startsWith 'onI18n '
          for j from [IMPORT_onI18n, IMPORT_onMount]
            auto_import.add j
          line = 'onMount '+line
    else if in_pug
      if line.startsWith '</template>'
        in_pug = false
      else
        line = line.replace(
          /:>([^\s\)]+)(\s|\)|$)/g
          (_,s1,s2)=>
            pug_i18n.add s1
            ':'+s1+'$'+s2
        ).replace(
          /(\s|")>([^\s"]+)(\b|")/g
          (_,s0,s1,s2)=>
            pug_i18n.add s1
            s0+'{@html '+s1+'$}'+s2
        )
    else if isScriptOpen(line)
      in_script = true
      script_line = pos
    else if isTemplateOpen(line)
      in_pug = true
    r.push line

  if pug_i18n.size and script_line != undefined
    js = []
    var_li = []
    dict_li = []

    # 已经 auto_import 了
    if not r[script_line].endsWith('>')
      js.push ''

    for i from [IMPORT_onI18n, IMPORT_onMount]
      if not auto_import.has i
        js.push IMPORT[i]

    # import_var = []
    for i from pug_i18n
      var_li.push i+'$'
      dict_li.push i+'$=this['+i18n['_$'+i]+']'

    # js.push "import {#{import_var.join(',')}} from 'I/lang@latest/I.js'"
    js.push "#{var_li.join('=')}=''"
    js.push "`onMount(onI18n(function(){#{dict_li.join(';')}}))`"
    r[script_line] += js.join(';')

  r = r.join('\n')

  # if ~ rfp.indexOf 'Lang.svelte'
  #   console.log r
  return r

< (dir)=>
  len = dir.length + 1
  i18n_fp = join(dir, ".gen/i18n/index.js")
  sveltePreprocess.unshift(
    markup: ({content, filename})=>
      if filename.endsWith '.svelte'
        relpeath = filename.slice(len)
        console.log greenBright relpeath
        return {
          code: svelte(
            content, filename, relpeath
            if existsSync(i18n_fp) then await import(i18n_fp) else {}
          )
        }
      return
  )
  return
