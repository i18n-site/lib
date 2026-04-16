import lex from "pug-lexer";
import { logger } from "./logger.js";
import { options as pugOptions } from "./options/index.js";
import { convergeOptions } from "./options/converge.js";
import { PugPrinter } from "./printer.js";
/** The plugin object that is picked up by prettier. */
export const plugin = {
  languages: [
    {
      name: "Pug",
      parsers: ["pug"],
      tmScope: "text.jade",
      aceMode: "jade",
      codemirrorMode: "pug",
      codemirrorMimeType: "text/x-pug",
      extensions: [".jade", ".pug"],
      linguistLanguageId: 179,
      vscodeLanguageIds: ["jade", "pug"],
    },
  ],
  /* eslint-disable jsdoc/require-jsdoc */
  parsers: {
    pug: {
      parse(text, _options) {
        logger.debug("[parsers:pug:parse]:", { text });
        let trimmedAndAlignedContent = text.replace(/^\s*\n/, "");
        const contentIndentation = /^\s*/.exec(trimmedAndAlignedContent);
        if (contentIndentation?.[0]) {
          const contentIndentationRegex = new RegExp(`(^|\\n)${contentIndentation[0]}`, "g");
          trimmedAndAlignedContent = trimmedAndAlignedContent.replace(
            contentIndentationRegex,
            "$1",
          );
        }

        // Pre-process to wrap unquoted Svelte expressions in attributes
        // e.g. onclick={back} -> onclick="{back}"
        // e.g. onclick!={back} -> onclick!="{back}"
        let processedContent = "",
          i = 0;
        while (i < trimmedAndAlignedContent.length) {
          const slice = trimmedAndAlignedContent.slice(i);
          // Skip JS code lines starting with - or = or != at the start of a line
          // Standard Pug attributes in () can also start with = if we are not careful
          // but here we check if it's at the start of the line.
          if (i === 0 || trimmedAndAlignedContent[i - 1] === "\n") {
            const jsMatch = slice.match(/^(!?=|-)\s/);
            if (jsMatch) {
              const lineEnd = trimmedAndAlignedContent.indexOf("\n", i),
                nextI = lineEnd === -1 ? trimmedAndAlignedContent.length : lineEnd;
              processedContent += trimmedAndAlignedContent.slice(i, nextI);
              i = nextI;
              continue;
            }
          }

          // Check for = { or != {
          // We only want to match if it's an attribute, usually preceded by a name or !
          const attrMatch = slice.match(/^(!?=)\s*\{/);
          if (attrMatch) {
            const op = attrMatch[1],
              // Find the actual { index
              braceIndex = trimmedAndAlignedContent.indexOf("{", i + op.length);

            // Append the operator and any spaces before {
            processedContent += trimmedAndAlignedContent.slice(i, braceIndex);

            let braceCount = 0,
              foundEnd = false;
            for (let j = braceIndex; j < trimmedAndAlignedContent.length; j++) {
              const char = trimmedAndAlignedContent[j];
              if (char === "{") braceCount++;
              else if (char === "}") braceCount--;

              if (braceCount === 0) {
                const quote = "`";
                processedContent +=
                  quote + trimmedAndAlignedContent.slice(braceIndex, j + 1) + quote;
                i = j + 1;
                foundEnd = true;
                break;
              }
            }
            if (!foundEnd) {
              processedContent += trimmedAndAlignedContent[i];
              i++;
            }
          } else {
            processedContent += trimmedAndAlignedContent[i];
            i++;
          }
        }

        const content = processedContent,
          tokens = lex(content);
        // console.log(JSON.stringify(tokens, null, 2));
        return { content, tokens };
      },
      astFormat: "pug-ast",
      hasPragma(text) {
        return text.startsWith("//- @prettier\n") || text.startsWith("//- @format\n");
      },
      locStart(node) {
        logger.debug("[parsers:pug:locStart]:", { node });
        return 0;
      },
      locEnd(node) {
        logger.debug("[parsers:pug:locEnd]:", { node });
        return 0;
      },
      preprocess(text, _options) {
        logger.debug("[parsers:pug:preprocess]:", { text });
        return text;
      },
    },
  },
  printers: {
    "pug-ast": {
      // @ts-expect-error: Prettier allow it to be async if we don't do recursively print
      async print(path, options) {
        const entry = path.stack[0];
        const { content, tokens } = entry;
        const pugOptions = convergeOptions(options);
        const printer = new PugPrinter(content, tokens, pugOptions);
        const result = await printer.build();
        logger.debug("[printers:pug-ast:print]:", result);
        return result;
      },
      insertPragma(text) {
        return `//- @prettier\n${text}`;
      },
    },
  },
  /* eslint-enable jsdoc/require-jsdoc */
  options: pugOptions,
  defaultOptions: {},
};
/** The languages that are picked up by prettier. */
export const languages = plugin.languages;
/** The parsers object that is picked up by prettier. */
export const parsers = plugin.parsers;
/** The printers object that is picked up by prettier. */
export const printers = plugin.printers;
/** The options object that is picked up by prettier. */
export const options = plugin.options;
/** The default options object that is picked up by prettier. */
export const defaultOptions = plugin.defaultOptions;
export { createLogger, Logger, logger, LogLevel } from "./logger.js";
