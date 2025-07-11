export default (li, size) =>
  r = []
  i = 0
  while i < li.length
    n = i + size
    r.push li.slice(i,n)
    i = n
  r
