export default (first, second) =>
  first.length == second.length and first.every(
    (value, index) => value == second[index]
  )
