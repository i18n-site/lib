> mime-types:mime

mime.types.js = 'text/javascript'

export default lookup = (i)=>
  r = mime.lookup i
  if r == false
    # https://developers.cloudflare.com/speed/optimization/content/brotli/content-compression/
    r = 'text/js'
  r

# console.log lookup '1pg'
