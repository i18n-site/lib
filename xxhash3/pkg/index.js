import {hash128 as _hash128,hash128Len as _hash128Len,hash as _hash,hashI64 as _hashI64} from './_.js'

const encoder = new TextEncoder(),
  encode = encoder.encode.bind(encoder),
  wrap = (func)=>{
    return (txt)=>{
      if (txt.constructor === String){
        txt = encode(txt);
      }
      return func(txt)
    }
  }
export const hash128 = wrap(_hash128)
export const hash128Len = wrap(_hash128Len)
export const hash = wrap(_hash)
export const hashI64 = wrap(_hashI64)