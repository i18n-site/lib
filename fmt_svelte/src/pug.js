import { format } from "prettier";
import { languages, options, parsers, printers } from "./pug/index.js";
import rgba2hex from "./rgba2hex.js";

export default async (code) => [
  rgba2hex(
    await format(code, {
      parser: "pug",
      plugins: [{ languages, options, parsers, printers }],
      pugAttributeSeparator: "none",
      pugSortAttributes: "as-is",
      pugEmptyAttributes: "none",
    }),
  ),
  [],
];
