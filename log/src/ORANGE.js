import {colored, default as colorer, IS_TTY} from './color.js'
export const orange = colored('38;2;255;68;0');
export default IS_TTY ? colorer(orange, console.log) : console.log