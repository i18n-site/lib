import lex from "pug-lexer";
import { logger } from "./logger.js";
import { options as pug_opts } from "./options/index.js";
import { convergeOptions } from "./options/converge.js";
import PugPrinter from "./printer.js";
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
        let trimmed_aligned = text.replace(/^\s*\n/, "");
        const indent = /^\s*/.exec(trimmed_aligned);
        if (indent?.[0]) {
          const indent_re = new RegExp(`(^|\\n)${indent[0]}`, "g");
          trimmed_aligned = trimmed_aligned.replace(
            indent_re,
            "$1",
          );
        }

        // Pre-process to wrap unquoted Svelte expressions in attributes
        // e.g. onclick={back} -> onclick="{back}"
        // e.g. onclick!={back} -> onclick!="{back}"
        let processed = "",
          i = 0;
        while (i < trimmed_aligned.length) {
          const slice = trimmed_aligned.slice(i);
          // Skip JS code lines starting with - or = or != at the start of a line
          // Standard Pug attributes in () can also start with = if we are not careful
          // but here we check if it's at the start of the line.
          if (i === 0 || trimmed_aligned[i - 1] === "\n") {
            const js_match = slice.match(/^(!?=|-)\s/);
            if (js_match) {
              const line_end = trimmed_aligned.indexOf("\n", i),
                next_i = line_end === -1 ? trimmed_aligned.length : line_end;
              processed += trimmed_aligned.slice(i, next_i);
              i = next_i;
              continue;
            }
          }

          // Check for = { or != {
          // We only want to match if it's an attribute, usually preceded by a name or !
          const attr_match = slice.match(/^(!?=)\s*\{/);
          if (attr_match) {
            const op = attr_match[1],
              // Find the actual { index
              brace_idx = trimmed_aligned.indexOf("{", i + op.length);

            // Append the operator and any spaces before {
            processed += trimmed_aligned.slice(i, brace_idx);

            let brace_cnt = 0,
              found_end = false;
            for (let j = brace_idx; j < trimmed_aligned.length; j++) {
              const char = trimmed_aligned[j];
              if (char === "{") brace_cnt++;
              else if (char === "}") brace_cnt--;

              if (brace_cnt === 0) {
                const quote = "`";
                processed +=
                  quote + trimmed_aligned.slice(brace_idx, j + 1) + quote;
                i = j + 1;
                found_end = true;
                break;
              }
            }
            if (!found_end) {
              processed += trimmed_aligned[i];
              i++;
            }
          } else {
            processed += trimmed_aligned[i];
            i++;
          }
        }

        const content = processed,
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
        const opts = convergeOptions(options);
        const printer = new PugPrinter(content, tokens, opts);
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
  options: pug_opts,
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
