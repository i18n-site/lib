import { default as colorer, colored } from "./color.js";
import IS_PROD from "./IS_PROD.js";

const log = (...args) => console.error("❌", ...args);

export default IS_PROD ? log : colorer(colored("0;31;1"), log);
