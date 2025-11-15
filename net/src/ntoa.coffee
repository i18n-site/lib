< (num) =>
  num = num >>> 0
  b1 = (num >>> 24) & 0xFF
  b2 = (num >>> 16) & 0xFF
  b3 = (num >>> 8) & 0xFF
  b4 = num & 0xFF
  "#{b1}.#{b2}.#{b3}.#{b4}"
