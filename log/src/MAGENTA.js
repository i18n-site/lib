import { colored, default as colorer, IS_TTY } from "./color.js";
export const magenta = colored(";35");
export default IS_TTY ? colorer(magenta, console.log) : console.log;
