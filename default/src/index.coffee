Map::default = (key, val)->
  r = @get key
  if not r
    r = val()
    @set key,r
  r

