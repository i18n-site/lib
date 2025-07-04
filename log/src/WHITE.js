import {colored, default as colorer}from './index.js'
export const white = colored(';37');
export default process.env.NODE_ENV==='production'?console.log:colorer(white,console.log)