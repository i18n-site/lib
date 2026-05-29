import {colored, default as colorer, IS_TTY} from './color.js'
export const white = colored(';37');
export default IS_TTY ? colorer(white, console.log) : console.log