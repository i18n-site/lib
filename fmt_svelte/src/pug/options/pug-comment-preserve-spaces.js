import { CATEGORY_PUG } from "./constants.js";
/** Pug comment preserve spaces option. */
export const PUG_COMMENT_PRESERVE_SPACES_OPTION = {
  // since: '1.6.0',
  category: CATEGORY_PUG,
  type: "choice",
  default: "keep-all",
  description: "Change behavior of spaces within comments.",
  choices: [
    {
      value: "keep-all",
      description: "Keep all spaces within comments. Example: `//    this  is   a   comment`",
    },
    {
      value: "keep-leading",
      description: "Keep leading spaces within comments. Example: `//    this is a comment`",
    },
    {
      value: "trim-all",
      description: "Trim all spaces within comments. Example: `// this is a comment`",
    },
  ],
};
/**
 * Format comment with the given settings.
 *
 * @param input The comment.
 * @param pugCommentPreserveSpaces How to preserve spaces in the comment.
 * @param pipeless Whether it's a pipeless comment ot not. Default: `false`.
 * @returns The formatted comment.
 */
export function formatPugCommentPreserveSpaces(input, pugCommentPreserveSpaces, pipeless = false) {
  switch (pugCommentPreserveSpaces) {
    case "keep-leading": {
      let result = "";
      let firstNonSpace = 0;
      for (
        firstNonSpace;
        firstNonSpace < input.length && input[firstNonSpace] === " ";
        firstNonSpace++
      ) {
        result += " ";
      }
      result += input.slice(firstNonSpace).trim().replaceAll(/\s\s+/g, " ");
      return result;
    }
    case "trim-all": {
      let result = input.trim();
      result = result.replaceAll(/\s\s+/g, " ");
      if (!pipeless && input[0] === " ") {
        result = ` ${result}`;
      }
      return result;
    }
    case "keep-all":
    default: {
      // Don't touch comment
      return input;
    }
  }
}
