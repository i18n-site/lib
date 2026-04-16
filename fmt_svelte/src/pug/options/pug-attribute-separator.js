import { CATEGORY_PUG } from './constants.js';
/** Pug attribute separator option. */
export const PUG_ATTRIBUTE_SEPARATOR_OPTION = {
    // since: '1.6.0',
    category: CATEGORY_PUG,
    type: 'choice',
    default: 'none',
    description: 'Change when attributes are separated by commas in tags.',
    choices: [
        {
            value: 'always',
            description: 'Always separate attributes with commas. Example: `button(type="submit", (click)="play()", disabled)`',
        },
        {
            value: 'as-needed',
            description: 'Only add commas between attributes where required. Example: `button(type="submit", (click)="play()" disabled)`',
        },
        {
            value: 'none',
            description: 'Never add commas between attributes. Example: `button(type="submit" @click="play()" :style="style" disabled)`',
        },
    ],
};
/**
 * Checks if the given `pugAttributeSeparator` is valid.
 *
 * @param pugAttributeSeparator The pugAttributeSeparator.
 * @returns The given `pugAttributeSeparator`.
 * @throws {Error} Error if the pugAttributeSeparator was not valid.
 */
export function resolvePugAttributeSeparatorOption(pugAttributeSeparator) {
    switch (pugAttributeSeparator) {
        case 'always':
        case 'as-needed':
        case 'none': {
            return pugAttributeSeparator;
        }
    }
    throw new Error(`Invalid option for pugAttributeSeparator. Found '${pugAttributeSeparator}'. Possible options: 'always', 'as-needed' or 'none'`);
}
