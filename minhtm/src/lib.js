import {
  minify
} from '@swc/html';

import extractReplace from '@3-/extract/extractReplace.js';

export default async(htm) => {
  const {
    code
  } = (await minify(Buffer.from(htm), {
    collapseWhitespaces: 'all',
    minifyCss: true,
    minifyJs: true,
    minifyJson: true,
    quotes: false,
    removeComments: true
  }));
  return extractReplace('<script type=importmap>', '</script>', (s) => {
    return JSON.stringify(JSON.parse(s));
  }, code) || code;
};
