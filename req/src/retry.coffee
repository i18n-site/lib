#!/usr/bin/env coffee

export default (func) =>
  (url, args...)=>
    retryed = 0
    loop
      try
        return await func(url, ...args)
      catch err
        if ++retryed < 9
          if err instanceof Response
            try
              err = err.status + ' : ' + await err.text()
            catch
              #
          console.error url, err
          continue
        throw err
    return
