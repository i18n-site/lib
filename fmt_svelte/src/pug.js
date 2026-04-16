import { format } from "prettier";
import { languages, options, parsers, printers } from "./pug/index.js";

export default async (code) =>
  await format(code, {
    parser: "pug",
    plugins: [{ languages, options, parsers, printers }],
    pugAttributeSeparator: "none",
    pugSortAttributes: "as-is",
    pugEmptyAttributes: "none",
  });
