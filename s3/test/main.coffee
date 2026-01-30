#!/usr/bin/env coffee

import { Readable } from 'stream'

> ../src/Aliyun.js
  ../src/stream.js
  # ../src/file2txt.js
  path > join

ROOT = import.meta.dirname
DIR_FILE = join ROOT, 'file'

{
  ALIBABA_CLOUD_ACCESS_KEY_ID
  ALIBABA_CLOUD_ACCESS_KEY_SECRET
} = process.env

BUCKET = 'any2txt'
OSS_ENDPOINT = 'oss-cn-zhangjiakou.aliyuncs.com'
REGION = 'cn-zhangjiakou'
IMM_PROJECT = 'any2txt'

aliyun = Aliyun {
  accessKey:ALIBABA_CLOUD_ACCESS_KEY_ID
  secretKey:ALIBABA_CLOUD_ACCESS_KEY_SECRET
  endPoint:OSS_ENDPOINT
  bucket:BUCKET
}

await Promise.all [
  "1.docx"
].map (name)=>
  path = name
  console.log await aliyun.putObject(
    path
    stream(join(DIR_FILE, name))
  )
  # await file2txt(
  #   ALIBABA_CLOUD_ACCESS_KEY_ID
  #   ALIBABA_CLOUD_ACCESS_KEY_SECRET
  #   REGION
  #   IMM_PROJECT
  #   BUCKET
  #   path
  # )
  return
