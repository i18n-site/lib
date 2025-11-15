#!/usr/bin/env coffee
> @3-/sleep
  lodash-es/merge.js

export default (
  token_li
  model='gemini-2.5-pro'
)=>
  token_li.sort( => Math.random() - 0.5 )
  _nextToken = ->
    loop
      for i from token_li
        yield i
    return

  _NEXT_TOKEN = _nextToken()

  nextToken = => _NEXT_TOKEN.next().value

  (text, schema, system, option)=>
    body = {
      contents: [
        {
          parts: [
            {
              text
            }
          ]
        }
      ]
    }

    if schema
      body.generationConfig = {
        responseMimeType: 'application/json'
        responseJsonSchema: schema
      }

    if option
      merge body, option

    if system
      body.system_instruction = {
        parts: [
          {
            text: system
          }
        ]
      }


    # console.log JSON.stringify body,null,2

    body = JSON.stringify body

    retryed = token_li.length

    loop
      try
        # console.log 'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent'
        r = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/'+model+':generateContent'
          {
            headers: {
              'X-goog-api-key': nextToken()
              'Content-Type': 'application/json'
            }
            method: 'POST'
            body
          }
        )
        {
          status
        } = r
      catch err
        console.error err
        await sleep(1000)
        continue

      if status != 200
        text = await r.text()
        if status == 429
          try
            { error } = JSON.parse text
            console.warn error.status, error.message
          catch
            console.warn text
          continue
        if [503,403,443,500].includes status
          try
            {
              error: {message}
            } = JSON.parse text
            console.warn status, message
          catch
            console.warn text
          if status != 500
            await sleep(1000)
          continue
        throw new Error(text)
      json = await r.json()
      {parts} = json.candidates[0].content
      if not parts
        console.warn 'miss parts', JSON.stringify json,null,2
        continue
      text = parts[0].text
      if schema
        try
          return JSON.parse text
        catch err
          console.error body, text, err
          if --retryed <= 0
            throw err
          continue
      return text
    return
