ENTITY =
  '&': '&amp;'
  '<': '&lt;'
  '>': '&gt;'

export default (str) =>
  str.replace /[&<>]/g, (char) =>
    ENTITY[char]
