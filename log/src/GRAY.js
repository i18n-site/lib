import {colored, default as colorer}from './index.js'
export const gray = colored(';90');
export default process.env.NODE_ENV==='production'?console.log:colorer(gray,console.log)