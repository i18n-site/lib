> ./styl.js
  ./i18n.js
  ./conf.js > ROOT

export default main = =>
  await Promise.all(
    [i18n, styl].map(
      (f)=>f(ROOT)
    )
  )
  return
