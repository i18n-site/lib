import IS_PROD from "./IS_PROD.js";
import { colored, default as colorer } from "./index.js";
export const orange = colored("38;2;255;68;0");
export default IS_PROD ? console.log : colorer(orange, console.log);
