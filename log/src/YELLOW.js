import {colored, default as colorer, IS_TTY} from './color.js'
export const yellow = colored(';33');
export default IS_TTY ? colorer(yellow, console.log) : console.log