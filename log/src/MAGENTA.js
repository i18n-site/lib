import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const magenta = colored(";35");
export default IS_PROD ? console.log : colorer(magenta, console.log);
