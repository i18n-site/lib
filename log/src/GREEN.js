import {colored, default as colorer}from './index.js'
export const green = colored(';32');
export default process.env.NODE_ENV==='production'?console.log:colorer(green,console.log)