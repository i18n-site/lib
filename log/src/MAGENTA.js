import {colored, default as colorer}from './color.js'
export const magenta = colored(';35');
export default process.env.NODE_ENV==='production'?console.log:colorer(magenta,console.log)