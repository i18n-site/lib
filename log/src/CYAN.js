import { colored, default as colorer, IS_TTY } from "./color.js";
export const cyan = colored(";36");
export default IS_TTY ? colorer(cyan, console.log) : console.log;
