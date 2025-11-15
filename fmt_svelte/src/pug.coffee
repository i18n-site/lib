> prettier

import * as pug from '@prettier/plugin-pug'

< (code) =>
  prettier.format code,
    parser: "pug"
    plugins: [pug]
    pugAttributeSeparator: "none"
    pugSortAttributes: "asc"
    pugEmptyAttributes: "none"
