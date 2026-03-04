import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const yellow = colored(";33");
export default IS_PROD ? console.log : colorer(yellow, console.log);
