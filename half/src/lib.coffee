全角标点 = "，、。！？：；"

export default (txt) =>
  li = []
  for line in txt.split('\n')
    result = ""
    i = 0
    while i < line.length
      char = line[i++]
      code = char.charCodeAt(0)

      # 检查字符是否在全角字符的范围内
      if code >= 0xFF01 and code <= 0xFF5E
        halfWidthChar = String.fromCharCode(code - 0xFEE0)
        result += halfWidthChar
        # 如果是全角标点
        if 全角标点.includes(char)
          next = line[i]
          if next and next.trim()
            result += ' '
            continue
      else if code == 0x3000
        # 特殊处理全角空格（0x3000），将其转换为普通空格
        result += ' '
      else
        # 非全角字符保持不变
        result += char

    li.push result.trimEnd()
  li.join('\n')
