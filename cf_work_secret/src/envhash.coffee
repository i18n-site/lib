> fs > readFileSync existsSync writeFileSync
  crypto > createHash
  dotenv
  @3-/u8/u8eq.js

HASH = 'sha256'

< (env_path) =>
  bin = readFileSync(env_path)
  hash_sum = createHash(HASH)
  hash_sum.update(bin)
  hash = hash_sum.digest()
  hash_path = env_path + '.'+HASH
  if existsSync(hash_path)
    if u8eq hash,readFileSync(hash_path)
      return
  [
    dotenv.parse(bin)
    =>
      writeFileSync(hash_path, hash)
      return
  ]

