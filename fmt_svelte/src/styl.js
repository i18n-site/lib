import {
  format
} from 'stylus-supremacy';

export default (stylus) => {
  return format(stylus, {
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
    sortProperties: "grouped",
    tabStopChar: "  "
  });
};
