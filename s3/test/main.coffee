#!/usr/bin/env coffee

import { Readable } from 'stream'

> ../src/Aliyun.js
  ../src/file2txt.js
  fs > createReadStream
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

aliyun = Aliyun(
  ALIBABA_CLOUD_ACCESS_KEY_ID
  ALIBABA_CLOUD_ACCESS_KEY_SECRET
  OSS_ENDPOINT
  BUCKET
)

await Promise.all [
  "1.pdf",
  # "1.png",
  "1.docx"
].map (name)=>
  path = name
  await aliyun.putObject(
    path
    Readable.toWeb(createReadStream(join(DIR_FILE, name)))
  )
  await file2txt(
    ALIBABA_CLOUD_ACCESS_KEY_ID
    ALIBABA_CLOUD_ACCESS_KEY_SECRET
    REGION
    IMM_PROJECT
    BUCKET
    path
  )
  return
