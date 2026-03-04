import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const white = colored(";37");
export default IS_PROD ? console.log : colorer(white, console.log);
