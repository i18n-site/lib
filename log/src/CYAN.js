import {colored, default as colorer}from './color.js'
export const cyan = colored(';36');
export default process.env.NODE_ENV==='production'?console.log:colorer(cyan,console.log)