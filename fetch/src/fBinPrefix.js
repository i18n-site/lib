import fBin from './fBin.js'

export default (U)=>(url, ...args)=> fBin(U + url, ...args)
