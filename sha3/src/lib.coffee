> crypto

export default (bin) =>
  hash = crypto.createHash('sha3-256')
  hash.update(bin)
  hash.digest()
