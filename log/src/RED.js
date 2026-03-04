import {colored, default as colorer}from './index.js'
export const red = colored(';31');
export default process.env.NODE_ENV==='production'?console.log:colorer(red,console.log)