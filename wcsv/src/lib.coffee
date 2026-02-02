> fs > mkdirSync createWriteStream
  path > dirname
  @fast-csv/format > format

< (path, gen, option)=>
  `option ??= {}`
  if not option.writeBOM
    option.writeBOM = true

  dir = dirname path
  mkdirSync(dir, { recursive: true })
  stream = createWriteStream path
  csv = format option
  csv.pipe stream
  { promise, resolve, reject } = Promise.withResolvers()
  try
    for await item from gen()
      csv.write item
  finally
    csv.end()
  stream.on 'finish', resolve
  stream.on 'error', reject
  return promise
