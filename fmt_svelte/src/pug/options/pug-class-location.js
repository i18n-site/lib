import { CATEGORY_PUG } from './constants.js';
/** Pug class location. */
export const PUG_CLASS_LOCATION = {
    // since: '1.19.0',
    category: CATEGORY_PUG,
    type: 'choice',
    default: 'before-attributes',
    description: 'Define where classes be placed.',
    choices: [
        {
            value: 'before-attributes',
            description: 'Forces all valid class literals to be placed before attributes.',
        },
        {
            value: 'after-attributes',
            description: 'Forces all valid class literals to be placed after attributes.',
        },
    ],
};
