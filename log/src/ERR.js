import { default as colorer, colored, IS_TTY } from "./color.js";

const log = (...args) => console.error("❌", ...args);

export default IS_TTY ? colorer(colored("0;31;1"), log) : log;


