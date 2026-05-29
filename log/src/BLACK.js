import {colored, default as colorer, IS_TTY} from './color.js'
export const black = colored(';30');
export default IS_TTY ? colorer(black, console.log) : console.log