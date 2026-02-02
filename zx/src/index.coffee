> ./log.js:
  zx > $

export * from 'zx'

export $raw = (args...)=>
  q = $.quote
  $.quote = (v) => v
  try
    return $(...args)
  finally
    $.quote = q
  return
