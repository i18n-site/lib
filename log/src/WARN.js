import { default as colorer, colored } from "./color.js";
import IS_PROD from "./IS_PROD.js";

const log = (...args) => console.warn("❗", ...args);

export default IS_PROD ? log : colorer(colored("38;2;255;68;0"), log);
