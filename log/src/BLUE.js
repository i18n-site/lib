import {colored, default as colorer}from './color.js'
export const blue = colored(';34');
export default process.env.NODE_ENV==='production'?console.log:colorer(blue,console.log)