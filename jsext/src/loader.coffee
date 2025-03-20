> ./jsext.js

< resolve = jsext

COMMONJS = {
  format: "commonjs",
  shortCircuit: true,
}

< load = (url, context, defaultLoad) =>
  if (url.endsWith(".node"))
    return COMMONJS
  return defaultLoad(url, context)
