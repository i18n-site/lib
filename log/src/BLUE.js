import { colored, default as colorer, IS_TTY } from "./color.js";
export const blue = colored(";34");
export default IS_TTY ? colorer(blue, console.log) : console.log;
