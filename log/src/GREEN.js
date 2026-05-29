import {colored, default as colorer, IS_TTY} from './color.js'
export const green = colored(';32');
export default IS_TTY ? colorer(green, console.log) : console.log