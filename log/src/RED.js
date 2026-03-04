import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const red = colored(";31");
export default IS_PROD ? console.log : colorer(red, console.log);
