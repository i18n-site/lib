import { CATEGORY_PUG } from "../constants.js";
/** Pug empty attributes option. */
export const PUG_EMPTY_ATTRIBUTES_OPTION = {
  // since: '1.10.0',
  category: CATEGORY_PUG,
  type: "choice",
  default: "as-is",
  description: "Change behavior of boolean attributes.",
  choices: [
    {
      value: "as-is",
      description: "Nothing is changed.",
    },
    {
      value: "none",
      description: "Every attribute with empty quotes will have them removed.",
    },
    {
      value: "all",
      description: "Every boolean attribute will be expressed with empty quotes.",
    },
  ],
};
/** Pug empty attributes force quotes option. */
export const PUG_EMPTY_ATTRIBUTES_FORCE_QUOTES_OPTION = {
  // since: '1.10.0',
  category: CATEGORY_PUG,
  type: "path",
  default: [{ value: [] }],
  array: true,
  description:
    'Define a list of patterns for attributes that will be forced to have empty quotes even with "none" selected.',
};
