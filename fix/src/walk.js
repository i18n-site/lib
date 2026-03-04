import { globbySync } from "globby";
export default (dirPath) =>
  globbySync(["**/*.js"], {
    cwd: dirPath,
    gitignore: true,
    absolute: true,
  });
