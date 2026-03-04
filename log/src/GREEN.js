import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const green = colored(";32");
export default IS_PROD ? console.log : colorer(green, console.log);
