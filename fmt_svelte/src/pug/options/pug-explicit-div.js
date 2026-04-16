import { CATEGORY_PUG } from './constants.js';
/** Pug default div tag. */
export const PUG_EXPLICIT_DIV = {
    // since: '1.16.0',
    category: CATEGORY_PUG,
    type: 'boolean',
    default: true,
    description: 'Include `div` tag when followed by literal class or id syntax',
};
