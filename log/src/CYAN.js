import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const cyan = colored(";36");
export default IS_PROD ? console.log : colorer(cyan, console.log);
