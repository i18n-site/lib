import fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { dirname } from 'node:path'
import { Readable } from 'node:stream'
import { finished } from 'node:stream/promises'


export wgetFetching = (fetching, path)=>
  response = await fetching
  if response.status is 200
    await fs.mkdir(dirname(path), { recursive: true })

    # 将 web stream 转换为 node stream
    web_stream = response.body
    node_stream = Readable.fromWeb(web_stream)

    # 创建写入流并等待下载完成
    write_stream = createWriteStream(path)
    p = new Promise (resolve, reject) =>
      write_stream.on('finish', resolve)
      write_stream.on('error', reject)
      return

    try
      await finished(node_stream.pipe(write_stream))
    catch error
      console.error('Error during streaming:', error)
      throw error
    finally
      write_stream.close()  # 确保写入流被关闭
    return p
  return

# url: 下载地址
# path: 保存路径
export default (url, path) =>
  wgetFetching fetch(url), path

