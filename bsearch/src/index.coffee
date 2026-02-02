< (li, n) ->
  left = 0
  right = li.length - 1

  while left < right
    mid = Math.floor((left + right) / 2)
    if li[mid] < n
      left = mid + 1
    else
      right = mid

  if left > 0
    if Math.abs(li[left] - n) > Math.abs(li[left - 1] - n)
      return left - 1

  return left
