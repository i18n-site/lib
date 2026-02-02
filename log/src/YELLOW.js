import {colored, default as colorer}from './index.js'
export const yellow = colored(';33');
export default process.env.NODE_ENV==='production'?console.log:colorer(yellow,console.log)