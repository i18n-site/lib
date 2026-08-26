#!/usr/bin/env coffee

> @google/generative-ai > GoogleGenerativeAI
  @3-/choose

export default (key_li, model)=>
  getKey = choose key_li

  option = {
    model: 'models/'+model
  }

  (prompt) =>
    ai = (new GoogleGenerativeAI(getKey())).getGenerativeModel(option)
    retryed = 0
    loop
      try
        result = await ai.generateContent(prompt)
      catch e
        if ++retryed < 9 and 'OTHER' != e?.response?.promptFeedback?.blockReason
          console.error e
          continue
        throw e
      return result.response.text()
    return
