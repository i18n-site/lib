import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const black = colored(";30");
export default IS_PROD ? console.log : colorer(black, console.log);
