import {colored, default as colorer}from './index.js'
export const orange = colored('38;2;255;68;0');
export default process.env.NODE_ENV==='production'?console.log:colorer(orange,console.log)