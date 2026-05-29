import {colored, default as colorer, IS_TTY} from './color.js'
export const red = colored(';31');
export default IS_TTY ? colorer(red, console.log) : console.log