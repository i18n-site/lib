#!/usr/bin/env coffee

> crypto:@ > createHash
  fs
  ./conf.js > HASH AES IV

< (passwd, input_stream, outfp)=>
  key = createHash(HASH).update(passwd).digest()
  cipher = crypto.createCipheriv(AES, key, IV)

  output = fs.createWriteStream(outfp+'.enc')
  input_stream.pipe(cipher).pipe(output)

  new Promise (resolve, reject)=>
    output.on('finish', resolve)
    output.on('error', reject)
    return
