< (ip) =>
  parts = ip.split '.'
  result = 0
  for i in [0..3]
    part = parseInt parts[i], 10
    result += part * Math.pow(256, 3 - i)
  result
