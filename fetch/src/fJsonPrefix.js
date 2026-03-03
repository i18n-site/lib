import f from './fJson.js'

export default (U)=>(url, ...args)=> f(U + url, ...args)
