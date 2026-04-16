import { format } from 'prettier';
import * as pug from '@prettier/plugin-pug';

export default async (code) => await format(code, {
  parser: 'pug',
  plugins: [pug],
  pugAttributeSeparator: 'none',
  pugSortAttributes: 'asc',
  pugEmptyAttributes: 'none'
});
