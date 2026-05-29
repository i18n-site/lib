import { types } from "node:util";
import { format } from "prettier";
import { DOCTYPE_SHORTCUT_REGISTRY } from "./doctype-shortcut-registry.js";
import { logger } from "./logger.js";
import { compareAttributeToken, partialSort } from "./options/attribute-sorting/utils.js";
import { formatEmptyAttribute } from "./options/empty-attributes/utils.js";
import { resolvePugAttributeSeparatorOption } from "./options/pug-attribute-separator.js";
import { formatPugCommentPreserveSpaces } from "./options/pug-comment-preserve-spaces.js";
import {
  isAngularAction,
  isAngularBinding,
  isAngularDirective,
  isAngularInterpolation,
} from "./utils/angular.js";
import {
  detectDangerousQuoteCombination,
  detectFramework,
  handleBracketSpacing,
  isMultilineInterpolation,
  isQuoted,
  isSingleLineWithInterpolation,
  isStyleAttribute,
  makeString,
  previousNormalAttributeToken,
  previousTagToken,
  previousTypeAttributeToken,
  unwrapLineFeeds,
} from "./utils/common.js";
import { getScriptParserName } from "./utils/script-mime-types.js";
import { isSvelteInterpolation } from "./utils/svelte.js";
import {
  isVueEventBinding,
  isVueExpression,
  isVueVBindExpression,
  isVueVDirective,
  isVueVForWithOf,
  isVueVOnExpression,
} from "./utils/vue.js";
/**
 * The printer class.
 */
export default class PugPrinter {
  content;
  tokens;
  options;
  result = "";
  /**
   * The index of the current token inside the `tokens` array.
   */
  // Start at -1, because `getNextToken()` increases it before retrieval
  current_index = -1;
  current_line_length = 0;
  indent_string;
  indent_level = 0;
  framework = "auto";
  quotes;
  otherQuotes;
  always_use_attribute_separator;
  never_use_attribute_separator;
  wrap_attributes_pattern;
  code_interpolation_options;
  current_tag_position = 0;
  possible_id_position = 0;
  possible_class_position = 0;
  previous_attribute_remapped = false;
  /**
   * Specifies whether attributes should be wrapped in a tag or not.
   */
  wrap_attributes = false;
  pipeless_text = false;
  pipeless_comment = false;
  currently_in_pug_interpolation = false;
  class_literal_to_attribute = [];
  class_literal_after_attributes = [];
  /**
   * Constructs a new pug printer.
   *
   * @param content The pug content string.
   * @param tokens The pug token array.
   * @param options Options for the printer.
   */
  constructor(content, tokens, options) {
    this.content = content;
    this.tokens = tokens;
    this.options = options;
    this.indent_string = options.pugUseTabs ? "\t" : " ".repeat(options.pugTabWidth);
    if (options.pugSingleFileComponentIndentation) {
      this.indent_level++;
    }
    this.framework = options.pugFramework === "auto" ? detectFramework() : options.pugFramework;
    this.quotes = this.options.pugSingleQuote ? "'" : '"';
    this.otherQuotes = this.options.pugSingleQuote ? '"' : "'";
    const pug_attribute_separator = resolvePugAttributeSeparatorOption(
        options.pugAttributeSeparator,
      ),
      wrap_attributes_pattern = options.pugWrapAttributesPattern;
    this.always_use_attribute_separator = pug_attribute_separator === "always";
    this.never_use_attribute_separator = pug_attribute_separator === "none";
    this.wrap_attributes_pattern = wrap_attributes_pattern
      ? new RegExp(wrap_attributes_pattern)
      : null;
    this.code_interpolation_options = {
      semi: options.pugSemi ?? options.semi,
      singleQuote: options.pugSingleQuote ?? options.singleQuote,
      bracketSpacing: options.pugBracketSpacing ?? options.bracketSpacing,
      arrowParens: options.pugArrowParens ?? options.arrowParens,
      printWidth: 9000,
      endOfLine: "lf",
      useTabs: options.pugUseTabs ?? options.useTabs,
      tabWidth: options.pugTabWidth ?? options.tabWidth,
      bracketSameLine: options.pugBracketSameLine ?? options.bracketSameLine,
    };
  }
  // ##     ## ######## ##       ########  ######## ########   ######
  // ##     ## ##       ##       ##     ## ##       ##     ## ##    ##
  // ##     ## ##       ##       ##     ## ##       ##     ## ##
  // ######### ######   ##       ########  ######   ########   ######
  // ##     ## ##       ##       ##        ##       ##   ##         ##
  // ##     ## ##       ##       ##        ##       ##    ##  ##    ##
  // ##     ## ######## ######## ##        ######## ##     ##  ######
  //#region Helpers
  get computed_indent() {
    switch (this.previous_token?.type) {
      case "newline":
      case "outdent": {
        return this.indent_string.repeat(this.indent_level);
      }
      case "indent": {
        return this.indent_string;
      }
      case "start-pug-interpolation": {
        return "";
      }
    }
    return this.options.pugSingleFileComponentIndentation ? this.indent_string : "";
  }
  get previous_token() {
    return this.tokens[this.current_index - 1];
  }
  get next_token() {
    return this.tokens[this.current_index + 1];
  }
  /**
   * Builds the formatted pug content.
   *
   * @returns The formatted pug content.
   */
  async build() {
    if (logger.isDebugEnabled()) {
      logger.debug("[PugPrinter:build]:", JSON.stringify(this.tokens));
    }
    const results = [];
    if (this.tokens[0]?.type === "text") {
      results.push("| ");
    } else if (this.tokens[0]?.type === "eos") {
      return "";
    }
    let token = this.getNextToken();
    while (token) {
      logger.debug("[PugPrinter:build]:", JSON.stringify(token));
      try {
        switch (token.type) {
          case "attribute":
          case "class":
          case "end-attributes":
          case "id":
          case "eos": {
            // TODO: These tokens write directly into the result
            this.result = results.join("");
            await this[token.type](
              // @ts-expect-error: The function is always valid
              token,
            );
            results.length = 0;
            results.push(this.result);
            break;
          }
          case "tag":
          case "start-attributes":
          case "interpolation":
          case "call":
          case ":": {
            // TODO: These tokens read the length of the result
            this.result = results.join("");
          }
          // eslint-disable-next-line no-fallthrough
          default: {
            if (typeof this[token.type] !== "function") {
              // eslint-disable-next-line unicorn/prefer-type-error
              throw new Error("Unhandled token: " + JSON.stringify(token));
            }
            results.push(
              await this[token.type](
                // @ts-expect-error: If the function would be invalid, it would be caught above
                token,
              ),
            );
            break;
          }
        }
      } catch (error) {
        throw new Error(error);
      }
      token = this.getNextToken();
    }
    return results.join("");
  }
  getNextToken() {
    this.current_index++;
    return this.tokens[this.current_index] ?? null;
  }
  quoteString(val) {
    return `${this.quotes}${val}${this.quotes}`;
  }
  checkTokenType(token, possibilities, invert = false) {
    return !!token && possibilities.includes(token.type) !== invert;
  }
  tokenNeedsSeparator(token) {
    return this.never_use_attribute_separator
      ? false
      : this.always_use_attribute_separator || /^([(:[]).*/.test(token.name);
  }
  getUnformattedContentLines(first_token, last_token) {
    const { start } = first_token.loc,
      { end } = last_token.loc,
      lines = this.content.split(/\r\n|\n|\r/),
      start_line = start.line - 1,
      end_line = end.line - 1,
      parts = [],
      first_line = lines[start_line];
    if (first_line !== undefined) {
      parts.push(first_line.slice(start.column - 1));
    }
    for (let line_number = start_line + 1; line_number < end_line; line_number++) {
      const line = lines[line_number];
      if (line !== undefined) {
        parts.push(line);
      }
    }
    const last_line = lines[end_line];
    if (last_line !== undefined) {
      parts.push(last_line.slice(0, end.column - 1));
    }
    return parts;
  }
  replaceTagWithLiteralIfPossible(search, replace) {
    if (this.options.pugExplicitDiv) {
      return;
    }
    const current_tag_end = Math.max(this.possible_id_position, this.possible_class_position),
      tag = this.result.slice(this.current_tag_position, current_tag_end),
      replaced = tag.replace(search, replace);
    if (replaced !== tag) {
      const prefix = this.result.slice(0, this.current_tag_position),
        suffix = this.result.slice(current_tag_end);
      this.result = `${prefix}${replaced}${suffix}`;
      // tag was replaced, so adjust possible positions as well
      const diff = tag.length - replaced.length;
      this.possible_id_position -= diff;
      this.possible_class_position -= diff;
    }
  }
  async frameworkFormat(code) {
    const opts = {
      ...this.code_interpolation_options,
      // we need to keep the original singleQuote option
      // see https://github.com/prettier/plugin-pug/issues/339
      singleQuote: this.options.singleQuote,
    };
    switch (this.framework) {
      case "angular": {
        opts.parser = "__ng_interpolation";
        break;
      }
      case "svelte":
      case "vue":
      default: {
        opts.parser = "babel";
        opts.semi = false;
      }
    }
    let result = await format(code, opts);
    if (result[0] === ";") {
      result = result.slice(1);
    }
    return result;
  }
  async formatText(text) {
    let result = "";
    while (text) {
      // Find double curly brackets
      const start = text.indexOf("{{");
      if (start === -1) {
        // Find single curly brackets for svelte
        const s2 = text.indexOf("{");
        if (this.options.pugFramework === "svelte" && s2 !== -1) {
          result += text.slice(0, s2);
          text = text.slice(s2 + 1);
          const e2 = text.indexOf("}");
          if (e2 === -1) {
            result += "{";
            result += text;
            text = "";
          } else {
            let code = text.slice(0, e2);
            try {
              const dangerous_quote_combination = detectDangerousQuoteCombination(
                code,
                this.quotes,
                this.otherQuotes,
                logger,
              );
              if (dangerous_quote_combination) {
                logger.warn(
                  "The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:",
                  code,
                );
                result += handleBracketSpacing(this.options.pugBracketSpacing, code);
                text = text.slice(e2 + 1);
                continue;
              } else {
                code = await this.frameworkFormat(code);
              }
            } catch (error) {
              logger.warn("[PugPrinter:formatText]: ", error);
              try {
                code = await format(code, {
                  parser: "babel",
                  ...this.code_interpolation_options,
                  singleQuote: !this.options.pugSingleQuote,
                });
                code = code.trim();
                if (code.at(-1) === ";") {
                  code = code.slice(0, -1);
                }
                if (code[0] === ";") {
                  code = code.slice(1);
                }
              } catch (error) {
                logger.warn(error);
              }
            }
            code = unwrapLineFeeds(code);
            result += handleBracketSpacing(this.options.pugBracketSpacing, code, ["{", "}"]);
            text = text.slice(e2 + 1);
          }
        } else {
          result += text;
          text = "";
        }
      } else {
        result += text.slice(0, start);
        text = text.slice(start + 2);
        const end = text.indexOf("}}");
        if (end === -1) {
          result += "{{";
          result += text;
          text = "";
        } else {
          let code = text.slice(0, end);
          try {
            const dangerous_quote_combination = detectDangerousQuoteCombination(
              code,
              this.quotes,
              this.otherQuotes,
              logger,
            );
            if (dangerous_quote_combination) {
              logger.warn(
                "The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:",
                code,
              );
              result += handleBracketSpacing(this.options.pugBracketSpacing, code);
              text = text.slice(end + 2);
              continue;
            } else {
              code = await this.frameworkFormat(code);
            }
          } catch (error) {
            if (typeof error === "string") {
              if (error.includes("Unexpected token Lexer Error")) {
                if (!error.includes("Unexpected character [`]")) {
                  logger.debug("[PugPrinter:formatText]: Using fallback strategy");
                }
              } else if (error.includes("Bindings cannot contain assignments")) {
                logger.warn(
                  "[PugPrinter:formatText]: Bindings should not contain assignments:",
                  `code: \`${code.trim()}\``,
                );
              } else if (error.includes("Unexpected token '('")) {
                if (this.framework !== "vue") {
                  logger.warn(
                    "[PugPrinter:formatText]: Found unexpected token `(`.",
                    `code: \`${code.trim()}\``,
                  );
                }
              } else if (error.includes("Missing expected `)`")) {
                if (this.framework !== "vue") {
                  logger.warn(
                    "[PugPrinter:formatText]: Missing expected `)`.",
                    `code: \`${code.trim()}\``,
                  );
                }
              } else if (error.includes("Missing expected `:`")) {
                if (this.framework !== "vue") {
                  logger.warn(
                    "[PugPrinter:formatText]: Missing expected `:`.",
                    `code: \`${code.trim()}\``,
                  );
                }
              } else {
                logger.warn("[PugPrinter:formatText]: ", error);
              }
              // else ignore message
            } else {
              logger.warn("[PugPrinter:formatText]: ", error);
            }
            try {
              code = await format(code, {
                parser: "babel",
                ...this.code_interpolation_options,
                singleQuote: !this.options.pugSingleQuote,
              });
              code = code.trim();
              if (code.at(-1) === ";") {
                code = code.slice(0, -1);
              }
              if (code[0] === ";") {
                code = code.slice(1);
              }
            } catch (error) {
              logger.warn(error);
            }
          }
          code = unwrapLineFeeds(code);
          result += handleBracketSpacing(this.options.pugBracketSpacing, code);
          text = text.slice(end + 2);
        }
      }
    }
    return result;
  }
  async formatDelegatePrettier(val, parser, format_options = {}) {
    const { trim_trailing_semi = false, trim_leading_semi = true } = format_options,
      opts = { ...this.code_interpolation_options },
      orig_val = val;
    val = val.trim();
    const was_quoted = isQuoted(val);
    if (was_quoted) {
      opts.singleQuote = !this.options.pugSingleQuote;
      val = val.slice(1, -1); // Remove quotes
    }
    try {
      val = await format(val, { parser, ...opts });
      val = unwrapLineFeeds(val);
      if (trim_trailing_semi && val.at(-1) === ";") {
        val = val.slice(0, -1);
      }
      if (trim_leading_semi && val[0] === ";") {
        val = val.slice(1);
      }
      if (was_quoted) {
        val =
          this.quotes === '"'
            ? // Escape double quotes, but only if they are not already escaped
              (val = val.replaceAll(/(?<!\\)((?:\\\\)*)"/g, '$1\\"'))
            : (val = val.replaceAll("'", "\\'"));
        val = this.quoteString(val);
      }
      return val;
    } catch (e) {
      logger.warn(`Failed to format delegate prettier with parser ${parser}: ${e.message}`);
      return orig_val;
    }
  }
  async formatStyleAttribute(val) {
    return this.formatDelegatePrettier(val, "css", {
      trim_trailing_semi: true,
    });
  }
  async formatVueEventBinding(val) {
    try {
      return await this.formatDelegatePrettier(val, "__vue_event_binding", {
        trim_trailing_semi: true,
      });
    } catch {
      return this.formatVueTsEventBinding(val);
    }
  }
  async formatVueTsEventBinding(val) {
    return this.formatDelegatePrettier(val, "__vue_ts_event_binding", {
      trim_trailing_semi: true,
    });
  }
  async formatVueExpression(val) {
    try {
      return await this.formatDelegatePrettier(val, "__vue_expression");
    } catch {
      return this.formatVueTsExpression(val);
    }
  }
  async formatVueTsExpression(val) {
    return this.formatDelegatePrettier(val, "__vue_ts_expression");
  }
  async formatAngularBinding(val) {
    return this.formatDelegatePrettier(val, "__ng_binding");
  }
  async formatAngularAction(val) {
    return this.formatDelegatePrettier(val, "__ng_action");
  }
  async formatAngularDirective(val) {
    return this.formatDelegatePrettier(val, "__ng_directive");
  }
  async formatFrameworkInterpolation(val, parser, opening, closing) {
    val = val.slice(1, -1); // Remove quotes
    val = val.slice(opening.length, -closing.length); // Remove braces
    val = val.trim();
    if (val.includes(`\\${this.otherQuotes}`)) {
      logger.warn(
        "The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:",
        val,
      );
    } else {
      const opts = {
        ...this.code_interpolation_options,
        singleQuote: !this.options.pugSingleQuote,
      };
      try {
        val = await format(val, { parser, ...opts });
      } catch {
        logger.warn(
          "The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:",
          val,
        );
      }
      val = unwrapLineFeeds(val);
    }
    val = handleBracketSpacing(this.options.pugBracketSpacing, val, [opening, closing]);
    return this.quoteString(val);
  }
  async formatAngularInterpolation(val) {
    return this.formatFrameworkInterpolation(val, "__ng_interpolation", "{{", "}}");
  }
  async formatSvelteInterpolation(val) {
    const was_quoted = isQuoted(val);
    if (was_quoted) {
      val = val.slice(1, -1); // Remove quotes
    }
    const opening = "{",
      closing = "}";
    val = val.slice(opening.length, -closing.length); // Remove braces
    val = val.trim();
    // Since there's no svelte-attribute-expression parser in Prettier,
    // we might try to format it as JS if it looks like one, or just keep it.
    try {
      // Try formatting as JS expression
      const formatted = await format(val, {
        parser: "__js_expression",
        ...this.code_interpolation_options,
        singleQuote: !this.options.pugSingleQuote,
      });
      val = formatted.trim();
    } catch {
      // Keep as is if it's not a valid JS expression (e.g. some svelte syntax)
    }
    val = unwrapLineFeeds(val);
    val = handleBracketSpacing(this.options.pugBracketSpacing, val, [opening, closing]);
    // If it was originally unquoted in the source (before our pre-processor wrapped it),
    // we should probably keep it unquoted.
    // For now, let's always return it unquoted as it's common in Svelte-Pug.
    return val;
  }
  //#endregion
  // ########  #######  ##    ## ######## ##    ##    ########  ########   #######   ######  ########  ######   ######   #######  ########   ######
  //    ##    ##     ## ##   ##  ##       ###   ##    ##     ## ##     ## ##     ## ##    ## ##       ##    ## ##    ## ##     ## ##     ## ##    ##
  //    ##    ##     ## ##  ##   ##       ####  ##    ##     ## ##     ## ##     ## ##       ##       ##       ##       ##     ## ##     ## ##
  //    ##    ##     ## #####    ######   ## ## ##    ########  ########  ##     ## ##       ######    ######   ######  ##     ## ########   ######
  //    ##    ##     ## ##  ##   ##       ##  ####    ##        ##   ##   ##     ## ##       ##             ##       ## ##     ## ##   ##         ##
  //    ##    ##     ## ##   ##  ##       ##   ###    ##        ##    ##  ##     ## ##    ## ##       ##    ## ##    ## ##     ## ##    ##  ##    ##
  //    ##     #######  ##    ## ######## ##    ##    ##        ##     ##  #######   ######  ########  ######   ######   #######  ##     ##  ######
  //#region Token Processors
  tag(token) {
    let val = token.val;
    if (
      val === "div" &&
      !this.options.pugExplicitDiv &&
      this.next_token &&
      ((this.next_token.type === "class" &&
        this.options.pugClassLocation === "before-attributes") ||
        this.next_token.type === "id")
    ) {
      val = "";
    }
    this.current_line_length += val.length;
    const result = `${this.computed_indent}${val}`;
    logger.debug(
      "tag",
      { result, val: token.val, length: token.val.length },
      this.current_line_length,
    );
    this.current_tag_position = this.result.length + this.computed_indent.length;
    this.possible_id_position = this.result.length + result.length;
    this.possible_class_position = this.result.length + result.length;
    return result;
  }
  ["start-attributes"](token) {
    let result = "";
    if (this.next_token?.type === "attribute") {
      this.previous_attribute_remapped = false;
      this.possible_class_position = this.result.length;
      result = "(";
      logger.debug(this.current_line_length);
      let tok = this.next_token,
        idx = this.current_index + 1,
        // In pug, tags can have two kind of attributes: normal attributes that appear between parentheses,
        // and literals for ids and classes, prefixing the parentheses, e.g.: `#id.class(attribute="value")`
        // https://pugjs.org/language/attributes.html#class-literal
        // https://pugjs.org/language/attributes.html#id-literal
        // In the stream of attribute tokens, distinguish those that can be converted to literals,
        // and count those that cannot (normal attributes) to determine the resulting line length correctly.
        has_lit_attrs = false,
        num_norm_attrs = 0;
      while (tok.type === "attribute") {
        if (
          !this.currently_in_pug_interpolation &&
          !this.wrap_attributes &&
          this.wrap_attributes_pattern?.test(tok.name)
        ) {
          this.wrap_attributes = true;
        }
        switch (tok.name) {
          case "class":
          case "id": {
            // If classes or IDs are defined as attributes and not converted to literals, count them toward attribute wrapping.
            if (
              (tok.name === "class" && this.options.pugClassNotation !== "literal") ||
              (tok.name === "id" && this.options.pugIdNotation !== "literal")
            ) {
              num_norm_attrs++;
            }
            has_lit_attrs = true;
            const val = tok.val.toString();
            if (isQuoted(val)) {
              this.current_line_length -= 2;
            }
            this.current_line_length += 1 + val.length;
            logger.debug(
              {
                tokenName: tok.name,
                length: tok.name.length,
              },
              this.current_line_length,
            );
            break;
          }
          default: {
            this.current_line_length += tok.name.length;
            if (num_norm_attrs > 0) {
              // This isn't the first normal attribute that will appear between parentheses,
              // add space and separator
              this.current_line_length += 1;
              if (this.tokenNeedsSeparator(tok)) {
                this.current_line_length += 1;
              }
            }
            logger.debug(
              {
                tokenName: tok.name,
                length: tok.name.length,
              },
              this.current_line_length,
            );
            const val = tok.val.toString();
            if (val.length > 0 && val !== "true") {
              this.current_line_length += 1 + val.length;
              logger.debug({ tokenVal: val, length: val.length }, this.current_line_length);
            }
            num_norm_attrs++;
            break;
          }
        }
        tok = this.tokens[++idx];
      }
      logger.debug("after token", this.current_line_length);
      if (
        has_lit_attrs && // Remove div as it will be replaced with the literal for id and/or class
        this.previous_token?.type === "tag" &&
        this.previous_token.val === "div" &&
        !this.options.pugExplicitDiv
      ) {
        this.current_line_length -= 3;
      }
      if (num_norm_attrs > 0) {
        // Add leading and trailing parentheses
        this.current_line_length += 2;
      }
      if (this.options.pugClassLocation === "after-attributes") {
        let c_idx = idx,
          c_tok = this.tokens[++c_idx];
        while (c_tok.type === "class") {
          const val = c_tok.val;
          // Add leading . for classes
          this.current_line_length += 1 + val.length;
          logger.debug({ tokenVal: val, length: val.length }, this.current_line_length);
          c_tok = this.tokens[++c_idx];
        }
      }
      logger.debug("final line length", {
        currentLineLength: this.current_line_length,
      });
      if (
        !this.currently_in_pug_interpolation &&
        !this.wrap_attributes &&
        (this.current_line_length > this.options.pugPrintWidth ||
          (this.options.pugWrapAttributesThreshold >= 0 &&
            num_norm_attrs > this.options.pugWrapAttributesThreshold))
      ) {
        this.wrap_attributes = true;
      }
      if (
        this.options.pugSortAttributes !== "as-is" ||
        this.options.pugSortAttributesEnd.length > 0 ||
        this.options.pugSortAttributesBeginning.length > 0
      ) {
        const start_idx = this.tokens.indexOf(token),
          end_idx = idx;
        if (end_idx - start_idx > 2) {
          this.tokens = partialSort(this.tokens, start_idx + 1, end_idx, (a, b) =>
            compareAttributeToken(
              a,
              b,
              this.options.pugSortAttributes,
              this.options.pugSortAttributesBeginning,
              this.options.pugSortAttributesEnd,
            ),
          );
        }
      }
    }
    return result;
  }
  async attribute(token) {
    formatEmptyAttribute(
      token,
      this.options.pugEmptyAttributes,
      this.options.pugEmptyAttributesForceQuotes,
    );
    if (typeof token.val === "string" && isQuoted(token.val) && token.val[0] !== "`") {
      if (token.name === "class" && this.options.pugClassNotation === "literal") {
        // Handle class attribute
        const val = token.val.slice(1, -1).trim(),
          classes = val.split(/\s+/),
          special_classes = [],
          normal_classes = [],
          valid_class_name_regex = /^-?[A-Z_a-z]+[\w-]*$/;
        for (const class_name of classes) {
          if (valid_class_name_regex.test(class_name)) {
            if (this.options.pugClassLocation === "after-attributes") {
              this.class_literal_after_attributes.push(class_name);
            } else {
              normal_classes.push(class_name);
            }
          } else {
            special_classes.push(class_name);
          }
        }
        if (normal_classes.length > 0) {
          // Write css-class in front of attributes
          const pos = this.possible_class_position;
          this.result = [
            this.result.slice(0, pos),
            ".",
            normal_classes.join("."),
            this.result.slice(pos),
          ].join("");
          this.possible_class_position += 1 + normal_classes.join(".").length;
          if (this.options.pugClassLocation === "before-attributes") {
            this.replaceTagWithLiteralIfPossible(/div\./, ".");
          }
        }
        if (special_classes.length > 0) {
          token.val = makeString(special_classes.join(" "), this.quotes);
          this.previous_attribute_remapped = false;
        } else {
          this.previous_attribute_remapped = true;
          return;
        }
      } else if (token.name === "id" && this.options.pugIdNotation !== "as-is") {
        // Handle id attribute
        let val = token.val;
        val = val.slice(1, -1);
        val = val.trim();
        const valid_id_name_regex = /^-?[A-Z_a-z]+[\w-]*$/;
        if (!valid_id_name_regex.test(val)) {
          val = makeString(val, this.quotes);
          this.result += "id";
          if (!token.mustEscape) {
            this.result += "!";
          }
          this.result += `=${val}`;
          return;
        }
        // Write css-id in front of css-classes
        const pos = this.possible_id_position,
          literal = `#${val}`;
        this.result = [this.result.slice(0, pos), literal, this.result.slice(pos)].join("");
        this.possible_class_position += literal.length;
        this.replaceTagWithLiteralIfPossible(/div#/, "#");
        this.previous_attribute_remapped = true;
        return;
      }
    }
    const has_norm_prev = previousNormalAttributeToken(this.tokens, this.current_index);
    if (
      this.previous_token?.type === "attribute" &&
      (!this.previous_attribute_remapped || has_norm_prev)
    ) {
      if (this.tokenNeedsSeparator(token)) {
        this.result += ",";
      }
      if (!this.wrap_attributes) {
        this.result += " ";
      }
    }
    this.previous_attribute_remapped = false;
    if (this.wrap_attributes) {
      this.result += "\n";
      this.result += this.indent_string.repeat(this.indent_level + 1);
    }
    this.result += token.name;
    if (typeof token.val === "boolean") {
      if (!token.val) {
        this.result += `=${token.val}`;
      }
    } else if (token.name === "class" && this.options.pugClassNotation === "attribute") {
      const val = isQuoted(token.val) ? token.val.slice(1, -1).trim() : token.val,
        classes = val.split(/\s+/);
      if (this.class_literal_to_attribute.length > 0) {
        for (let i = this.class_literal_to_attribute.length - 1; i > -1; i--) {
          const class_name = this.class_literal_to_attribute.splice(i, 1)[0];
          if (class_name) {
            classes.unshift(class_name);
          }
        }
      }
      this.result += `=${
        isQuoted(token.val) ? this.quoteString(classes.join(" ")) : classes.join(" ")
      }`;
    } else {
      let val = token.val;
      if (isMultilineInterpolation(val)) {
        // do not reformat multiline strings surrounded by `
      } else if (isSingleLineWithInterpolation(val)) {
        // do not reformat single line interpolated strings surrounded by `
        // cannot format due to it would expect e.g. json in js and then see a dollar sign that cannot be handled
        // see https://github.com/prettier/plugin-pug/issues/238#issuecomment-873224173
      } else if (isVueVForWithOf(token.name, val)) {
        val = await this.formatDelegatePrettier(val, "vue");
      } else if (isVueExpression(token.name)) {
        val = await this.formatVueExpression(val);
      } else if (isVueEventBinding(token.name)) {
        val = await this.formatVueEventBinding(val);
      } else if (this.framework === "vue" && isVueVDirective(token.name)) {
        val = await this.formatVueExpression(val);
      } else if (isVueVBindExpression(token.name)) {
        val = await this.formatDelegatePrettier(val, "__js_expression");
      } else if (isVueVOnExpression(token.name)) {
        val = await this.formatDelegatePrettier(val, "__js_expression");
      } else if (isAngularBinding(token.name)) {
        val = await this.formatAngularBinding(val);
      } else if (isAngularAction(token.name)) {
        val = await this.formatAngularAction(val);
      } else if (isAngularDirective(token.name)) {
        val = await this.formatAngularDirective(val);
      } else if (isAngularInterpolation(val)) {
        val = await this.formatAngularInterpolation(val);
      } else if (isSvelteInterpolation(val)) {
        val = await this.formatSvelteInterpolation(val);
      } else if (isStyleAttribute(token.name, token.val)) {
        val = await this.formatStyleAttribute(val);
      } else {
        // Prevent wrong quotation if there is an extra whitespace at the end
        const r_trim_val = val.trimEnd();
        if (isQuoted(r_trim_val)) {
          val = makeString(r_trim_val.slice(1, -1), this.quotes);
        } else if (val === "true") {
          // The value is exactly true and is not quoted
          return;
        } else if (token.mustEscape) {
          val = await format(val, {
            parser: "__js_expression",
            ...this.code_interpolation_options,
            singleQuote: !this.options.pugSingleQuote,
          });
          const lines = val.split("\n"),
            code_indent_level = this.wrap_attributes ? this.indent_level + 1 : this.indent_level;
          if (lines.length > 1) {
            val = lines[0] ?? "";
            for (let index = 1; index < lines.length; index++) {
              val += "\n";
              val += this.indent_string.repeat(code_indent_level);
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              val += lines[index];
            }
          }
        } else {
          // The value is not quoted and may be js-code
          val = val.trim();
          val = val.replaceAll(/\s\s+/g, " ");
          if (val[0] === "{" && val[1] === " ") {
            val = `{${val.slice(2)}`;
          }
        }
      }
      if (!token.mustEscape) {
        this.result += "!";
      }
      this.result += `=${val}`;
    }
  }
  ["end-attributes"](_token) {
    if (this.wrap_attributes && this.result.at(-1) !== "(") {
      if (!this.options.pugBracketSameLine) {
        this.result += "\n";
      }
      this.result += this.indent_string.repeat(
        this.indent_level + this.options.pugClosingBracketIndentDepth,
      );
    }
    this.wrap_attributes = false;
    if (this.class_literal_to_attribute.length > 0) {
      if (this.previous_token?.type === "start-attributes") {
        this.result += "(";
      } else if (this.previous_token?.type === "attribute") {
        this.result += " ";
      }
      const classes = this.class_literal_to_attribute.splice(0);
      this.result += `class=${this.quoteString(classes.join(" "))}`;
      if (this.previous_token?.type === "start-attributes") {
        this.result += ")";
      }
    }
    if (this.result.at(-1) === "(") {
      // There were no attributes
      this.result = this.result.slice(0, -1);
    } else if (this.previous_token?.type === "attribute") {
      if (this.options.pugBracketSameLine) {
        this.result = this.result.trimEnd();
      }
      this.result += ")";
    } else if (
      this.options.pugPreserveAttributeBrackets &&
      this.previous_token?.type === "start-attributes"
    ) {
      this.result += "()";
    }
    if (this.result.at(-1) === ")" && this.class_literal_after_attributes.length > 0) {
      const classes = this.class_literal_after_attributes.splice(0);
      this.result += `.${classes.join(".")}`;
    }
    if (this.options.pugClassLocation === "after-attributes") {
      this.possible_class_position = this.result.length;
    }
    if (this.next_token?.type === "text" || this.next_token?.type === "path") {
      this.result += " ";
    }
  }
  indent(_token) {
    const result = `\n${this.indent_string.repeat(this.indent_level)}`;
    this.indent_level++;
    this.current_line_length = result.length - 1 + 1 + this.options.pugTabWidth; // -1 for \n, +1 for non zero based
    logger.debug(
      "indent",
      {
        result,
        indentLevel: this.indent_level,
        pugTabWidth: this.options.pugTabWidth,
      },
      this.current_line_length,
    );
    return result;
  }
  outdent(token) {
    let result = "";
    if (this.previous_token && this.previous_token.type !== "outdent") {
      if (token.loc.start.line - this.previous_token.loc.end.line > 1) {
        // Insert one extra blank line
        result += "\n";
      }
      result += "\n";
    }
    this.indent_level--;
    this.current_line_length = 1 + this.indent_string.repeat(this.indent_level).length; // -1 for \n, +1 for non zero based
    logger.debug("outdent", { result, indentLevel: this.indent_level }, this.current_line_length);
    return result;
  }
  class(token) {
    if (this.options.pugClassNotation === "attribute") {
      this.class_literal_to_attribute.push(token.val);
      // An extra div should be printed if...
      if (
        this.previous_token === undefined ||
        // ...the previous token indicates that this was the first class literal and thus a div did not previously exist...
        this.checkTokenType(this.previous_token, ["tag", "class", "end-attributes"], true) ||
        // ...OR the previous token is a div that will be removed because of the no explicit divs rule.
        (this.previous_token.type === "tag" &&
          this.previous_token.val === "div" &&
          this.next_token?.type !== "attribute" &&
          !this.options.pugExplicitDiv)
      ) {
        this.result += `${this.computed_indent}div`;
      }
      if (
        this.checkTokenType(this.next_token, ["text", "newline", "indent", "outdent", "eos", ":"])
      ) {
        // Copy and clear the class literals list.
        const classes = this.class_literal_to_attribute.splice(0);
        // If the last result character was a )...
        if (this.result.at(-1) === ")") {
          // Look for 'class=' that is before the last '('...
          const attr_start_idx = this.result.lastIndexOf("("),
            last_class_idx = this.result.indexOf("class=", attr_start_idx);
          // If a 'class=' is found...
          // eslint-disable-next-line unicorn/prefer-ternary, unicorn/consistent-existence-index-check -- This is more readable without ternaries.
          if (last_class_idx > -1) {
            // ...then insert the new class into it.
            this.result = [
              this.result.slice(0, last_class_idx + 7),
              classes.join(" "),
              " ",
              this.result.slice(last_class_idx + 7),
            ].join("");
          } else {
            // ...otherwise add a new class attribute into the existing attributes.
            this.result =
              this.result.slice(0, -1) +
              `${this.never_use_attribute_separator ? " " : ", "}class=${this.quoteString(classes.join(" "))})`;
          }
          // ...or if the element has no attributes...
        } else {
          // Start a new attribute list with the class attribute in it.
          this.result += `(class=${this.quoteString(classes.join(" "))})`;
        }
        if (this.next_token?.type === "text") {
          this.result += " ";
        }
      }
    } else {
      const val = `.${token.val}`;
      this.current_line_length += val.length;
      logger.debug(
        "before class",
        {
          result: this.result,
          val,
          length: val.length,
          previousToken: this.previous_token,
        },
        this.current_line_length,
      );
      switch (this.previous_token?.type) {
        case undefined:
        case "newline":
        case "outdent":
        case "indent": {
          const optional_div =
            this.options.pugExplicitDiv || this.options.pugClassLocation === "after-attributes"
              ? "div"
              : "";
          let result = `${this.computed_indent}${optional_div}`;
          if (this.options.pugClassLocation === "after-attributes") {
            this.class_literal_after_attributes.push(val.slice(1));
          } else {
            result += val;
          }
          this.current_line_length += optional_div.length;
          this.possible_id_position =
            this.result.length + this.computed_indent.length + optional_div.length;
          this.result += result;
          this.possible_class_position = this.result.length;
          break;
        }
        case "end-attributes": {
          const prefix = this.result.slice(0, this.possible_class_position);
          this.result = [prefix, val, this.result.slice(this.possible_class_position)].join("");
          this.possible_class_position += val.length;
          break;
        }
        default: {
          if (this.options.pugClassLocation === "after-attributes") {
            this.class_literal_after_attributes.push(val.slice(1));
          } else {
            const prefix = this.result.slice(0, this.possible_class_position);
            this.result = [prefix, val, this.result.slice(this.possible_class_position)].join("");
            this.possible_class_position += val.length;
          }
          break;
        }
      }
      if (
        this.options.pugClassLocation === "after-attributes" &&
        this.class_literal_after_attributes.length > 0
      ) {
        let result = this.result.slice(0, this.possible_class_position);
        if (
          ["text", "newline", "indent", "outdent", "eos", "code", ":", undefined].includes(
            this.next_token?.type,
          )
        ) {
          const classes = this.class_literal_after_attributes.splice(0);
          result += "." + classes.join(".");
        }
        this.result = [result, this.result.slice(this.possible_class_position)].join("");
        this.possible_class_position = this.result.length;
        this.replaceTagWithLiteralIfPossible(/div\./, ".");
      }
      logger.debug(
        "after class",
        { result: this.result, val, length: val.length },
        this.current_line_length,
      );
      if (this.next_token?.type === "text" && !/^\s+$/.test(this.next_token.val)) {
        this.current_line_length += 1;
        this.result += " ";
      }
    }
  }
  eos(_token) {
    // Remove all newlines at the end
    while (this.result.at(-1) === "\n") {
      this.result = this.result.slice(0, -1);
    }
    // Insert one newline
    this.result += "\n";
  }
  comment(comment_token) {
    let result = this.computed_indent;
    // See if this is a `//- prettier-ignore` comment, which would indicate that the part of the template
    // that follows should be left unformatted. Support the same format as typescript-eslint is using for descriptions:
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-ts-comment.md#allow-with-description
    if (/^ prettier-ignore($|[ :])/.test(comment_token.val)) {
      // Use a separate token processing loop to find the end of the stream of tokens to be ignored by formatting,
      // and uses their `loc` properties to retrieve the original pug code to be used instead.
      let token = this.getNextToken();
      if (token) {
        let skip_newline = token.type === "newline",
          ignore_level = 0;
        while (token) {
          const { type } = token;
          if (type === "newline" && ignore_level === 0) {
            // Skip first newline after `prettier-ignore` comment
            if (skip_newline) {
              skip_newline = false;
            } else {
              break;
            }
          }
          // eslint-disable-next-line unicorn/prefer-switch
          else if (type === "indent") {
            ignore_level++;
          } else if (type === "outdent") {
            ignore_level--;
            if (ignore_level <= 0) {
              if (ignore_level < 0) {
                this.indent_level--;
              }
              break;
            }
          } else if (type === "eos") {
            break;
          }
          token = this.getNextToken();
        }
        if (token) {
          const lines = this.getUnformattedContentLines(comment_token, token),
            // Trim the last line, since indentation of formatted pug is handled separately.
            last_line = lines.pop();
          if (last_line !== undefined) {
            lines.push(last_line.trimEnd());
          }
          result += lines.join("\n");
          if (token.type === "eos") {
            result += "\n";
          }
        }
      }
    } else {
      if (this.checkTokenType(this.previous_token, ["newline", "indent", "outdent"], true)) {
        result += " ";
      }
      result += "//";
      if (!comment_token.buffer) {
        result += "-";
      }
      result += formatPugCommentPreserveSpaces(
        comment_token.val,
        this.options.pugCommentPreserveSpaces,
      );
      if (this.next_token?.type === "start-pipeless-text") {
        this.pipeless_comment = true;
      }
    }
    return result;
  }
  newline(token) {
    let result = "";
    if (this.previous_token && token.loc.start.line - this.previous_token.loc.end.line > 1) {
      // Insert one extra blank line
      result += "\n";
    }
    result += "\n";
    this.current_line_length = 1 + this.indent_string.repeat(this.indent_level).length; // -1 for \n, +1 for non zero based
    logger.debug("newline", { result, indentLevel: this.indent_level }, this.current_line_length);
    return result;
  }
  async text(token) {
    let result = "",
      val = token.val,
      needs_trailing_ws = false,
      ends_with_ws = val.at(-1) === " " && !/^\s+$/.test(val);
    if (this.pipeless_text) {
      switch (this.previous_token?.type) {
        case "newline": {
          if (val.trim().length > 0) {
            result += this.indent_string.repeat(this.indent_level + 1);
          }
          break;
        }
        case "start-pipeless-text": {
          result += this.indent_string;
          break;
        }
      }
      if (this.pipeless_comment) {
        val = formatPugCommentPreserveSpaces(val, this.options.pugCommentPreserveSpaces, true);
      }
    } else {
      if (this.next_token && ends_with_ws) {
        switch (this.next_token.type) {
          case "interpolated-code":
          case "start-pug-interpolation": {
            needs_trailing_ws = true;
            break;
          }
        }
      }
      val = val.replaceAll(/\s\s+/g, " ");
      switch (this.previous_token?.type) {
        case "newline": {
          result += this.indent_string.repeat(this.indent_level);
          if (this.options.pugPreserveWhitespace && /^ .+$/.test(val)) {
            result += "|\n";
            result += this.indent_string.repeat(this.indent_level);
          }
          result += "|";
          if (/.*\S.*/.test(token.val) || this.next_token?.type === "start-pug-interpolation") {
            result += " ";
          }
          break;
        }
        case "indent":
        case "outdent": {
          result += this.computed_indent;
          if (this.options.pugPreserveWhitespace && /^ .+$/.test(val)) {
            result += "|\n";
            result += this.indent_string.repeat(this.indent_level);
          }
          result += "|";
          if (/.*\S.*/.test(token.val) || this.next_token?.type === "start-pug-interpolation") {
            result += " ";
          }
          break;
        }
        case "interpolated-code":
        case "end-pug-interpolation": {
          if (/^ .+$/.test(val) || val === " ") {
            result += " ";
          } else if (/^.+ $/.test(val)) {
            needs_trailing_ws = true;
          }
          break;
        }
      }
      val = val.trim();
      val = await this.formatText(val);
      val = val.replaceAll(/#([[{])/g, "\\#$1");
    }
    if (
      this.checkTokenType(this.previous_token, [
        "tag",
        "id",
        "interpolation",
        "call",
        "&attributes",
        "filter",
      ])
    ) {
      if (val.length === 0 && this.next_token?.type === "indent") {
        ends_with_ws = false;
      } else {
        val = ` ${val}`;
      }
    }
    result += val;
    if (needs_trailing_ws) {
      result += " ";
    }
    if (ends_with_ws && this.next_token?.type === "indent") {
      result += "\n" + this.indent_string.repeat(this.indent_level + 1) + "|";
    }
    return result;
  }
  ["interpolated-code"](token) {
    let result = "";
    switch (this.previous_token?.type) {
      case "tag":
      case "class":
      case "id":
      case "end-attributes": {
        result = " ";
        break;
      }
      case "start-pug-interpolation": {
        result = "| ";
        break;
      }
      case "indent":
      case "newline":
      case "outdent": {
        result = this.computed_indent;
        result += this.pipeless_text ? this.indent_string : "| ";
        break;
      }
    }
    result += token.mustEscape ? "#" : "!";
    result += handleBracketSpacing(this.options.pugBracketSpacing, token.val.trim(), ["{", "}"]);
    return result;
  }
  async formatRawCode(val, use_semi) {
    val = await format(val, {
      parser: "babel",
      ...this.code_interpolation_options,
      semi: use_semi,
      // Always pass endOfLine 'lf' here to be sure that the next `val.slice(0, -1)` call is always working
      endOfLine: "lf",
    });
    return val.slice(0, -1);
  }
  async formatRawCodeWithFallbackNoElse(val, use_semi) {
    try {
      return await this.formatRawCode(val, use_semi);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      const m = /Unexpected token \(1:(\d+)\)/.exec(error.message),
        n = Number(m?.[1]);
      // If the error is not from the very end of the code, then this fallback approach won't work, so we throw the original error.
      if (val.length + 1 !== n) throw error;
      // At this point, we know the SyntaxError is from the fact that there's no statement after our val's statement, implying we likely need a block after it. Using an empty block to get babel to parse it without affecting the code semantics.
      // Example: `if (foo)` is not valid JS on its own, but `if (foo) {}` is.
      try {
        // Look for comments at the end of the line, since we have to insert the block in between the statement and the comment or else the block will potentially be commented out
        const comment_idx = val.search(/\/(?:\/|\*).*$/);
        if (comment_idx === -1) {
          val += "{}";
        } else {
          val = `${val.slice(0, comment_idx)}{}${val.slice(comment_idx)}`;
        }
        val = await this.formatRawCode(val, use_semi);
        /*
                Strip out the empty block, which prettier has now formatted to split across two lines, and if there was a comment, it's now at the end of the second line. The first \s is to account for the space prettier inserted between the statement and the empty block.
                Input:
                `if (foo)   // comment`
        
                Transformed:
                `if (foo)   {}// comment`
        
                Initial formatted:
                `if (foo) {
                 } // comment`
        
                Final formatted:
                `if (foo) // comment`
                */
        const ma = /\s{\n?}(.*)$/.exec(val);
        if (!ma) throw new Error("No follow-up block found");
        const comment = ma[1];
        val = val.slice(0, ma.index) + (comment ?? "");
        return val.trim();
      } catch (second_error) {
        logger.debug("[PugPrinter] fallback format error", second_error);
        // throw original error since our fallback didn't work
        throw error;
      }
    }
  }
  // Since every line is parsed independently, babel will throw a SyntaxError if the line of code is only valid when there is another statement after it, or if the line starts with `else if` or `else`. This is a hack to get babel to properly parse what would otherwise be an invalid standalone JS line (e.g., `if (foo)`, `else if (bar)`, `else`)
  async formatRawCodeWithFallback(val, use_semi) {
    if (val.startsWith("else")) {
      // If the code starts with `else`, then we can format the code without the `else` keyword, and then add it back onto the start.
      // We can call the same helper function in each case, just with different inputs, so we can easily handle all `if`, `else if`, and `else` cases without having to write out each one.
      const no_else = await this.formatRawCodeWithFallbackNoElse(val.slice(4), use_semi);
      // `no_else` will either be an empty string or it will contain a comment. Now we just prepend `else` onto the start and trim in case `no_else` is empty
      return `else ${no_else}`.trim();
    } else {
      return await this.formatRawCodeWithFallbackNoElse(val, use_semi);
    }
  }
  async code(token) {
    let result = this.computed_indent;
    if (!token.mustEscape && token.buffer) {
      result += "!";
    }
    result += token.buffer ? "=" : "-";
    let use_semi = this.options.pugSemi;
    if (use_semi && (token.mustEscape || token.buffer)) {
      use_semi = false;
    }
    let val = token.val;
    try {
      const val_bak = val;
      val = await this.formatRawCodeWithFallback(val, use_semi);
      if (val[0] === ";") {
        val = val.slice(1);
      }
      if (val.includes("\n")) {
        val = val_bak;
      }
    } catch (error) {
      logger.warn("[PugPrinter]:", error);
    }
    result += ` ${val}`;
    return result;
  }
  id(token) {
    const val = `#${token.val}`;
    this.current_line_length += val.length;
    switch (this.previous_token?.type) {
      case undefined:
      case "newline":
      case "outdent":
      case "indent": {
        const optional_div = this.options.pugExplicitDiv ? "div" : "",
          result = `${this.computed_indent}${optional_div}${val}`;
        this.current_line_length += optional_div.length;
        this.result += result;
        this.possible_class_position = this.result.length;
        break;
      }
      default: {
        const prefix = this.result.slice(0, this.possible_id_position);
        this.possible_class_position += val.length;
        this.result = [prefix, val, this.result.slice(this.possible_id_position)].join("");
        break;
      }
    }
  }
  async ["start-pipeless-text"](_token) {
    this.pipeless_text = true;
    let result = `\n${this.indent_string.repeat(this.indent_level)}`;
    if (this.previous_token?.type === "dot") {
      const last_tag_tok = previousTagToken(this.tokens, this.current_index);
      let parser;
      switch (last_tag_tok?.val) {
        case "script": {
          parser = getScriptParserName(previousTypeAttributeToken(this.tokens, this.current_index));
          break;
        }
        case "style": {
          parser = "css";
          break;
        }
        default: {
          break;
        }
      }
      if (parser) {
        let idx = this.current_index + 1,
          tok = this.tokens[idx],
          raw = "",
          used_interpolated = false;
        while (tok && tok.type !== "end-pipeless-text") {
          switch (tok.type) {
            case "text": {
              raw += tok.val;
              break;
            }
            case "newline": {
              raw += "\n";
              break;
            }
            case "interpolated-code": {
              used_interpolated = true;
              raw += tok.mustEscape ? "#" : "!";
              raw += `{${tok.val}}`;
              break;
            }
            default: {
              logger.warn(
                "[PugPrinter:start-pipeless-text]:",
                "Unhandled token for pipeless script tag:",
                JSON.stringify(tok),
              );
              break;
            }
          }
          idx++;
          tok = this.tokens[idx];
        }
        try {
          result = await format(raw, {
            parser,
            ...this.code_interpolation_options,
          });
        } catch (error) {
          if (!used_interpolated) {
            logger.error(error);
            throw error;
          }
          // Continue without formatting the content
          const warn_ctx = [
            "[PugPrinter:start-pipeless-text]:",
            "The following expression could not be formatted correctly.",
            "This is likely a syntax error or an issue caused by the missing execution context.",
            "If you think this is a bug, please open a bug issue.",
          ];
          // TODO: If other token types occur use `if (used_interpolated)`
          // eslint-disable-next-line unicorn/no-immediate-mutation
          warn_ctx.push(
            `\ncode: \`${raw.trim()}\``,
            "\nYou used interpolated code in your pipeless script tag, so you may ignore this warning.",
          );
          if (types.isNativeError(error)) {
            warn_ctx.push(`\nFound ${parser} ${error.name}: ${error.message}.`);
          } else {
            logger.debug("typeof error:", typeof error);
            warn_ctx.push(`\nUnexpected error for parser ${parser}.`, error);
          }
          logger.warn(...warn_ctx);
          result = raw;
        }
        result = result.trimEnd();
        const indent_str = this.indent_string.repeat(this.indent_level + 1);
        result = result
          .split("\n")
          .map((line) => (line ? indent_str + line : ""))
          .join("\n");
        result = `\n${result}`;
        // Preserve newline
        tok = this.tokens[idx - 1];
        if (tok?.type === "text" && tok.val === "") {
          result += "\n";
        }
        this.current_index = idx - 1;
      }
    }
    return result;
  }
  ["end-pipeless-text"](_token) {
    this.pipeless_text = false;
    this.pipeless_comment = false;
    return "";
  }
  doctype(token) {
    let result = `${this.computed_indent}doctype`;
    if (token.val) {
      result += ` ${token.val}`;
    }
    return result;
  }
  dot(_token) {
    return ".";
  }
  block(token) {
    let result = `${this.computed_indent}block `;
    if (token.mode !== "replace") {
      result += `${token.mode} `;
    }
    result += token.val;
    return result;
  }
  extends(_token) {
    const indent = this.options.pugSingleFileComponentIndentation ? this.indent_string : "";
    return `${indent}extends `;
  }
  path(token) {
    let result = "";
    if (this.checkTokenType(this.previous_token, ["include", "filter"])) {
      result += " ";
    }
    result += token.val;
    return result;
  }
  ["start-pug-interpolation"](_token) {
    let result = "";
    if (
      this.pipeless_text &&
      this.tokens[this.current_index - 2]?.type === "newline" &&
      this.previous_token?.type === "text" &&
      this.previous_token.val.trim().length === 0
    ) {
      result += this.indent_string.repeat(this.indent_level + 1);
    }
    this.currently_in_pug_interpolation = true;
    result += "#[";
    return result;
  }
  ["end-pug-interpolation"](_token) {
    this.currently_in_pug_interpolation = false;
    return "]";
  }
  interpolation(token) {
    const result = `${this.computed_indent}#{${token.val}}`;
    this.current_line_length += result.length;
    this.possible_id_position = this.result.length + result.length;
    this.possible_class_position = this.result.length + result.length;
    return result;
  }
  include(_token) {
    return `${this.computed_indent}include`;
  }
  filter(token) {
    return `${this.computed_indent}:${token.val}`;
  }
  async call(token) {
    let result = `${this.computed_indent}+${token.val}`,
      args = token.args;
    if (args) {
      args = args.trim().replaceAll(/\s\s+/g, " ");
      // Place an x at the beginning to preserve brackets,
      // then remove the x after format.
      args = await format(`x(${args})`, {
        parser: "babel",
        ...this.code_interpolation_options,
      });
      args = args.trim();
      if (args.at(-1) === ";") {
        args = args.slice(0, -1);
      }
      args = args.slice(1);
      args = unwrapLineFeeds(args);
      result += args;
    }
    this.current_line_length += result.length;
    this.possible_id_position = this.result.length + result.length;
    this.possible_class_position = this.result.length + result.length;
    return result;
  }
  async mixin(token) {
    let result = `${this.computed_indent}mixin ${token.val}`,
      args = token.args;
    if (args) {
      args = args.trim().replaceAll(/\s\s+/g, " ");
      // Let args act as args of js function during format.
      args = await format(`function x(${args}) {}`, {
        parser: "babel",
        ...this.code_interpolation_options,
      });
      args = args.trim().slice(10, -3);
      result += args;
    }
    return result;
  }
  async if(token) {
    let result = this.computed_indent;
    const match = /^!\((.*)\)$/.exec(token.val);
    logger.debug("[PugPrinter]:", match);
    let append = "if ",
      code = token.val;
    if (match) {
      append = "unless ";
      code = match[1];
    }
    result += append;
    if (typeof code === "string") {
      code = await format(code, {
        parser: "__js_expression",
        ...this.code_interpolation_options,
        singleQuote: !this.options.pugSingleQuote,
      });
    }
    result += String(code).trim();
    return result;
  }
  ["mixin-block"](_token) {
    return `${this.computed_indent}block`;
  }
  else(_token) {
    return `${this.computed_indent}else`;
  }
  async ["&attributes"](token) {
    const code = await format(token.val, {
        parser: "__js_expression",
        ...this.code_interpolation_options,
        singleQuote: !this.options.pugSingleQuote,
      }),
      result = `&attributes(${code})`;
    this.current_line_length += result.length;
    return result;
  }
  ["text-html"](token) {
    const match = /^<(.*?)>(.*)<\/(.*?)>$/.exec(token.val);
    logger.debug("[PugPrinter]:", match);
    if (match) {
      return `${this.computed_indent}${match[1]} ${match[2]}`;
    }
    const entry = Object.entries(DOCTYPE_SHORTCUT_REGISTRY).find(
      ([key]) => key === token.val.toLowerCase(),
    );
    if (entry) {
      return `${this.computed_indent}${entry[1]}`;
    }
    return `${this.computed_indent}${token.val}`;
  }
  async each(token) {
    let result = `${this.computed_indent}each ${token.val}`;
    if (token.key !== null) {
      result += `, ${token.key}`;
    }
    const code = await format(token.code, {
      parser: "__js_expression",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
    });
    result += ` in ${unwrapLineFeeds(code.trim())}`;
    return result;
  }
  async eachOf(token) {
    let value = token.value.trim();
    value = await format(value, {
      parser: "babel",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
    });
    value = value.trim();
    if (value.at(-1) === ";") {
      value = value.slice(0, -1);
    }
    if (value[0] === ";") {
      value = value.slice(1);
    }
    value = unwrapLineFeeds(value);
    let code = await format(token.code, {
      parser: "__js_expression",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
      semi: true,
    });
    code = code.trim();
    return `${this.computed_indent}each ${value} of ${code}`;
  }
  async while(token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computed_indent}while ${code.trim()}`;
  }
  async case(token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computed_indent}case ${code.trim()}`;
  }
  async when(token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computed_indent}when ${code.trim()}`;
  }
  [":"](_token) {
    this.possible_id_position = this.result.length + 2;
    this.possible_class_position = this.result.length + 2;
    return ": ";
  }
  default(_token) {
    return `${this.computed_indent}default`;
  }
  async ["else-if"](token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.code_interpolation_options,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computed_indent}else if ${code.trim()}`;
  }
  blockcode(_token) {
    return `${this.computed_indent}-`;
  }
  yield(_token) {
    return `${this.computed_indent}yield`;
  }
  slash(_token) {
    let result = "/";
    if (this.next_token?.type === "text") {
      result += " ";
    }
    return result;
  }
}
