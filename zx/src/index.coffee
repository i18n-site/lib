> zx/globals:
  zx > log:_log

if process.stdout.isTTY
  POST = '\x1B[1;32mPOST\x1B[0m'
else
  POST = 'POST'

$.log = (entry) =>
  if entry.kind == 'fetch'
    if entry.init.method == 'POST'
      console.log POST, entry.url
      return
  _log(entry)
  return

export $raw = (args...)=>
  q = $.quote
  $.quote = (v) => v
  try
    return $(...args)
  finally
    $.quote = q
  return
