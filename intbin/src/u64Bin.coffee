export default (n) =>
  buf = Buffer.alloc(6)
  buf.writeUIntLE(n, 0, 6)

  i = 6

  while i > 0
    p = i - 1
    if buf[p] != 0
      break
    i = p

  buf.subarray(0, i)

