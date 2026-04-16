import { format } from "prettier";
import { languages, options, parsers, printers } from "@prettier/plugin-pug";

export default async (code) =>
  await format(code, {
    parser: "pug",
    plugins: [{ languages, options, parsers, printers }],
    pugAttributeSeparator: "none",
    pugSortAttributes: "asc",
    pugEmptyAttributes: "none",
  });
