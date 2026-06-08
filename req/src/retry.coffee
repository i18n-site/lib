#!/usr/bin/env coffee
> @3-/sleep

export default (func) =>
  (url, args...)=>
    retryed = 0
    loop
      try
        return await func(url, ...args)
      catch err
        if ++retryed < 4
          if err instanceof Response
            try
              err = err.status + ' : ' + await err.text()
            catch
              #
          console.error url, err
          await sleep(1e3)
          continue
        throw err
    return
