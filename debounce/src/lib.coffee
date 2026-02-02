export default (wait, func) =>
  + timeout
  (args...)->
    clearTimeout(timeout)
    timeout = setTimeout(
      func.bind(this,...args)
      wait
    )
    return

