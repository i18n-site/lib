import { colored, default as colorer, IS_TTY } from "./color.js";
export const gray = colored(";90");
export default IS_TTY ? colorer(gray, console.log) : console.log;
