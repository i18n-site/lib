> @3-/aiapi
  ./CONF.js
  js-yaml > dump load
  @3-/sleep

< (key_li, from_lang, to_lang)=>
  {
    POST
  } = aiapi(
    CONF.api
    key_li
  )
  prompt = "补全下面yaml数组中#{from_lang}的#{to_lang}翻译:"
  translate = (
    li
  ) =>
    t = []
    for i from li
      o = {}
      o[from_lang] = i
      o[to_lang] = ''
      t.push o
    if not t.length
      return []
    li = t
    body = {
      model: CONF.model
      messages: [
        {
          role: "user",
          content: prompt+dump(
            li
          )
        }
      ]
      stream: false
      max_tokens: 4096
      # stop: ""
      temperature: 0.7
      top_p: 0.7
      top_k: 50
      frequency_penalty: 0.5
      # response_format: {
      #   type: "text"
      # }
    }
    r = await POST(
      'chat/completions'
      body
    )
    answer = r.choices[0].message.content.split('\n')
    t = []
    for line from answer
      first_char = line.charAt(0)
      if first_char == '-'
        if not line.startsWith '- '
          line = '- '+line.slice(1)
      else if first_char != ' '
        continue
      t.push line.replace(':',': ')
    ft = new Map
    try
      yml = load t.join('\n')
    catch err
      console.error answer, err
      throw err
    for i from yml
      f = i[from_lang]
      t = i[to_lang]
      if f and t
        ft.set f, t
    return ft

  (li)=>
    t = []
    exist = new Set
    for i from li
      i = i.trim()
      if i
        if exist.has i
          continue
        exist.add i
        t.push i
    li = t
    retryed = 0
    traned = new Map
    tran_li = li
    while retryed < 10
      try
        new_traned = await translate tran_li
      catch err
        if ++retryed > 9
          throw err
        console.error retryed, err
        await sleep 9000*retryed
        continue
      tran_li = []
      for i from li
        if traned.has i
          continue
        new_tran = new_traned.get i
        if new_tran
          traned.set i, new_tran.toString()
          continue
        tran_li.push i
      if tran_li.length
        ++retryed
      else
        r = []
        for i from li
          r.push [
            i
            traned.get i
          ]
        return r
    return



