import lex from "pug-lexer";
import { logger, createLogger, LogLevel } from "./logger.js";
import { options as pug_opts } from "./options/index.js";
import { convergeOptions } from "./options/converge.js";
import PugPrinter from "./printer.js";

const plugin = {
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
  parsers: {
    pug: {
      parse: (text, _options) => {
        logger.debug("[parsers:pug:parse]:", { text });
        let trimmed_aligned = text.replace(/^\s*\n/, "");
        const indent = /^\s*/.exec(trimmed_aligned);
        if (indent?.[0]) {
          const indent_re = new RegExp(`(^|\\n)${indent[0]}`, "g");
          trimmed_aligned = trimmed_aligned.replace(indent_re, "$1");
        }

        let processed = "",
          i = 0;
        while (i < trimmed_aligned.length) {
          const slice = trimmed_aligned.slice(i);
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

          const attr_match = slice.match(/^(!?=)\s*\{/);
          if (attr_match) {
            const op = attr_match[1],
              brace_idx = trimmed_aligned.indexOf("{", i + op.length);

            processed += trimmed_aligned.slice(i, brace_idx);

            let brace_cnt = 0,
              found_end = false;
            for (let j = brace_idx; j < trimmed_aligned.length; j++) {
              const char = trimmed_aligned[j];
              if (char === "{") brace_cnt++;
              else if (char === "}") brace_cnt--;

              if (brace_cnt === 0) {
                processed += "`" + trimmed_aligned.slice(brace_idx, j + 1) + "`";
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

        return { content: processed, tokens: lex(processed) };
      },
      astFormat: "pug-ast",
      hasPragma: (text) => text.startsWith("//- @prettier\n") || text.startsWith("//- @format\n"),
      locStart: (node) => {
        logger.debug("[parsers:pug:locStart]:", { node });
        return 0;
      },
      locEnd: (node) => {
        logger.debug("[parsers:pug:locEnd]:", { node });
        return 0;
      },
      preprocess: (text, _options) => {
        logger.debug("[parsers:pug:preprocess]:", { text });
        return text;
      },
    },
  },
  printers: {
    "pug-ast": {
      print: async (path, options) => {
        const { content, tokens } = path.stack[0];
        const result = await new PugPrinter(content, tokens, convergeOptions(options)).build();
        logger.debug("[printers:pug-ast:print]:", result);
        return result;
      },
      insertPragma: (text) => `//- @prettier\n${text}`,
    },
  },
  options: pug_opts,
  defaultOptions: {},
};

export const languages = plugin.languages,
  parsers = plugin.parsers,
  printers = plugin.printers,
  options = plugin.options,
  defaultOptions = plugin.defaultOptions;

export { createLogger, logger, LogLevel };

export default {
  ...plugin,
  createLogger,
  logger,
  LogLevel,
};
