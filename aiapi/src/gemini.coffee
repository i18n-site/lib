#!/usr/bin/env coffee
> @3-/sleep
  lodash-es/merge.js

export default (token_li)=>
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

    loop
      try
        r = await fetch(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent'
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
        if status == 503
          try
            {
              error: {message}
            } = JSON.parse text
            console.warn status, message
          catch
            console.warn text
          await sleep(1000)
          continue
        throw new Error(text)
      r = (await r.json()).candidates[0]
      if schema
        r = r.content.parts[0].text
        try
          r = JSON.parse r
        catch err
          console.error r
          throw err
      return r
    return
