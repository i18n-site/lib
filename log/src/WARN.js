import { default as colorer, colored, IS_TTY } from "./color.js";

const log = (...args) => console.warn("❗", ...args);

export default IS_TTY ? colorer(colored("38;2;255;68;0"), log) : log;


