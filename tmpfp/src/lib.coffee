
> os > tmpdir
  crypto
  path > join

TMPDIR = tmpdir()

< =>
  join TMPDIR, crypto.randomBytes(16).toString('base64url')
