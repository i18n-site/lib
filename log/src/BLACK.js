import {colored, default as colorer}from './color.js'
export const black = colored(';30');
export default process.env.NODE_ENV==='production'?console.log:colorer(black,console.log)