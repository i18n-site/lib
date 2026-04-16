import prettier from 'prettier';

import * as pug from '@prettier/plugin-pug';

export default (code) => {
  return prettier.format(code, {
    parser: "pug",
    plugins: [pug],
    pugAttributeSeparator: "none",
    pugSortAttributes: "asc",
    pugEmptyAttributes: "none"
  });
};
