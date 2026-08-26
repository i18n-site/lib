import { CATEGORY_PUG } from "./constants.js";
/** Pug preserve whitespace. */
export const PUG_PRESERVE_WHITESPACE = {
  // since: '3.3.0',
  category: CATEGORY_PUG,
  type: "boolean",
  // TODO @alexis-aquanty 2025-03-31: considering defaulting to false in v4
  default: true,
  description: "Preserve additional whitespace in text.",
};
