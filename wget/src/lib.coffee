import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { dirname } from 'node:path'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'

# url: 下载地址
# path: 保存路径
< (url, path) =>
  response = await fetch url

  if response.status is 200
    await fs.mkdir dirname(path), recursive: true

    # 将 web stream 转换为 node stream
    web_stream = response.body
    node_stream = Readable.fromWeb web_stream

    # 创建写入流并等待下载完成
    write_stream = createWriteStream path
    await finished node_stream.pipe write_stream
  return
