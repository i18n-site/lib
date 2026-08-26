< =>
  {prepareStackTrace} = Error

  Error.prepareStackTrace = (err, stack) => stack

  try
    err = new Error()
    caller = err.stack[2]
    line = caller.getFileName()+':'+caller.getLineNumber()+':'+caller.getColumnNumber()
  catch
    null

  Error.prepareStackTrace = prepareStackTrace
  line
