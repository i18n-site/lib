import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const blue = colored(";34");
export default IS_PROD ? console.log : colorer(blue, console.log);
