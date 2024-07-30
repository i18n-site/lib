> ./PG_ENV.js > UINT
  os > homedir
  fs > existsSync
  @3-/write
  path > join

UINT_FP = join(
  homedir()
  ".cache/pg/uint/#{hostname}/#{port}/#{username}/#{db[1..]}.mjs"
)

if existsSync UINT_FP
  {default:uint} = await import(UINT_FP)
else
  Q = await conn(PG_URI)
  uint = await Q"select oid,typname from pg_type where typname in ('u64','u32','u16','u8','i8')".values()
  write(
    UINT_FP
    'export default '+JSON.stringify uint
  )

UINT.push ...uint
