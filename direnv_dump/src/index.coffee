#!/usr/bin/env coffee
> path > dirname join
  zlib
  @3-/utf8/utf8d.js

{ DIRENV_DIFF } = process.env

unzip = (buffer) =>
  decompressedData = Buffer.alloc 0

  try
    decompressedData = zlib.inflateSync buffer
  catch err
    if err.code == 'Z_DATA_ERROR'
      console.warn 'Ignoring CRC error:', err.message
      # 返回部分解压的数据或空Buffer
    else
      throw err

  decompressedData

env = JSON.parse utf8d await unzip Buffer.from(DIRENV_DIFF, 'base64url')

li = []
for [k,v] from Object.entries(env.n)
  if not [
    'PATH'
    'RUSTFLAGS'
  ].includes(k) and not k.startsWith 'DIRENV_'
    v = JSON.stringify(v)
    li.push "#{k}=#{v}"

console.log li.join('\n')

