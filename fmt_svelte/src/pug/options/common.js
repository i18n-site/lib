import { CATEGORY_PUG } from "./constants.js";

export const PUG_PRINT_WIDTH_OPTION = {
    category: CATEGORY_PUG,
    type: "int",
    default: -1,
    description: "The line length where Prettier will try wrap.",
    range: { start: -1, end: Number.POSITIVE_INFINITY, step: 1 },
  },
  PUG_SINGLE_QUOTE_OPTION = {
    category: CATEGORY_PUG,
    type: "choice",
    default: null,
    description: "",
    choices: [
      {
        value: null,
        description: "Use `singleQuote` value.",
      },
      {
        value: true,
        description: "Use single quotes instead of double quotes.",
      },
      {
        value: "true",
        description: "Use single quotes instead of double quotes.",
      },
      {
        value: false,
        description: "Use double quotes instead of double quotes.",
      },
    ],
  },
  PUG_TAB_WIDTH_OPTION = {
    category: CATEGORY_PUG,
    type: "int",
    default: -1,
    description: "Number of spaces per indentation level.",
    range: { start: -1, end: Number.POSITIVE_INFINITY, step: 1 },
  },
  PUG_USE_TABS_OPTION = {
    category: CATEGORY_PUG,
    type: "choice",
    default: null,
    description: "",
    choices: [
      {
        value: null,
        description: "Use `useTabs` value.",
      },
      {
        value: true,
        description: "Indent with tabs instead of spaces.",
      },
      {
        value: "true",
        description: "Indent with tabs instead of spaces.",
      },
      {
        value: false,
        description: "Indent with spaces instead of tabs.",
      },
    ],
  },
  PUG_BRACKET_SPACING_OPTION = {
    category: CATEGORY_PUG,
    type: "choice",
    default: null,
    description: "",
    choices: [
      {
        value: null,
        description: "Use `bracketSpacing` value.",
      },
      {
        value: true,
        description: "Print spaces between brackets.",
      },
      {
        value: "true",
        description: "Print spaces between brackets.",
      },
      {
        value: false,
        description: "Do not print spaces between brackets.",
      },
    ],
  },
  PUG_SEMI_OPTION = {
    category: CATEGORY_PUG,
    type: "choice",
    default: null,
    description: "",
    choices: [
      {
        value: null,
        description: "Use `bracketSpacing` value.",
      },
      {
        value: true,
        description: "Print semicolons.",
      },
      {
        value: "true",
        description: "Print semicolons.",
      },
      {
        value: false,
        description:
          "Do not print semicolons, except at the beginning of lines which may need them.",
      },
    ],
  },
  PUG_ARROW_PARENS_OPTION = {
    category: CATEGORY_PUG,
    type: "choice",
    default: null,
    description: "Include parentheses around a sole arrow function parameter.",
    choices: [
      {
        value: null,
        description: "Use `arrowParens` value.",
      },
      {
        value: "always",
        description: "Always add parens. Example: `(x) => x`",
      },
      {
        value: "avoid",
        description: "Omit parens when possible. Example: `x => x`",
      },
    ],
  },
  PUG_BRACKET_SAME_LINE_OPTION = {
    category: CATEGORY_PUG,
    type: "choice",
    default: null,
    description: "Determines position of closing bracket which wraps attributes.",
    choices: [
      {
        value: null,
        description: "Use `bracketSameLine` value.",
      },
      {
        value: true,
        description:
          "\n\t\t\tClosing bracket remains with last attribute's line.\n\t\t\tExample:\n\t\t\tinput(\n\t\t\ttype='text',\n\t\t\tvalue='my_value',\n\t\t\tname='my_name',\n\t\t\talt='my_alt',\n\t\t\tautocomplete='on')\n\t\t\t",
      },
      {
        value: "true",
        description:
          "\n\t\t\tClosing bracket remains with last attribute's line.\n\t\t\tExample:\n\t\t\tinput(\n\t\t\ttype='text',\n\t\t\tvalue='my_value',\n\t\t\tname='my_name',\n\t\t\talt='my_alt',\n\t\t\tautocomplete='on')\n\t\t\t",
      },
      {
        value: false,
        description:
          "\n\t\t\tClosing bracket ends with a new line.\n\t\t\tExample:\n\t\t\tinput(\n\t\t\ttype='text',\n\t\t\tvalue='my_value',\n\t\t\tname='my_name',\n\t\t\talt='my_alt',\n\t\t\tautocomplete='on'\n\t\t\t)\n\t\t\t",
      },
    ],
  };
