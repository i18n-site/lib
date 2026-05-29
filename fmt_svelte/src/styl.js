import { format } from "stylus-supremacy";
import rgba2hex from "./rgba2hex.js";

export default (txt) => [
  rgba2hex(
    format(txt, {
      alwaysUseImport: true,
      alwaysUseZeroWithoutUnit: true,
      insertBraces: false,
      insertColons: false,
      insertNewLineAroundBlocks: true,
      insertNewLineAroundImports: true,
      insertNewLineAroundOthers: true,
      insertNewLineAroundProperties: true,
      insertSemicolons: false,
      preserveNewLinesBetweenPropertyValues: true,
      reduceMarginAndPaddingValues: true,
      sortProperties: false,
      tabStopChar: "  ",
      insertSpaceBeforeComment: false,
      insertSpaceAfterComment: false,
    }),
  ),
  [],
];
