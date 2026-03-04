import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const gray = colored(";90");
export default IS_PROD ? console.log : colorer(gray, console.log);
