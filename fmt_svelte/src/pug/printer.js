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
export class PugPrinter {
  content;
  tokens;
  options;
  result = "";
  /**
   * The index of the current token inside the `tokens` array.
   */
  // Start at -1, because `getNextToken()` increases it before retrieval
  currentIndex = -1;
  currentLineLength = 0;
  indentString;
  indentLevel = 0;
  framework = "auto";
  quotes;
  otherQuotes;
  alwaysUseAttributeSeparator;
  neverUseAttributeSeparator;
  wrapAttributesPattern;
  codeInterpolationOptions;
  currentTagPosition = 0;
  possibleIdPosition = 0;
  possibleClassPosition = 0;
  previousAttributeRemapped = false;
  /**
   * Specifies whether attributes should be wrapped in a tag or not.
   */
  wrapAttributes = false;
  pipelessText = false;
  pipelessComment = false;
  currentlyInPugInterpolation = false;
  classLiteralToAttribute = [];
  classLiteralAfterAttributes = [];
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
    this.indentString = options.pugUseTabs ? "\t" : " ".repeat(options.pugTabWidth);
    if (options.pugSingleFileComponentIndentation) {
      this.indentLevel++;
    }
    this.framework = options.pugFramework === "auto" ? detectFramework() : options.pugFramework;
    this.quotes = this.options.pugSingleQuote ? "'" : '"';
    this.otherQuotes = this.options.pugSingleQuote ? '"' : "'";
    const pugAttributeSeparator = resolvePugAttributeSeparatorOption(options.pugAttributeSeparator);
    this.alwaysUseAttributeSeparator = pugAttributeSeparator === "always";
    this.neverUseAttributeSeparator = pugAttributeSeparator === "none";
    const wrapAttributesPattern = options.pugWrapAttributesPattern;
    this.wrapAttributesPattern = wrapAttributesPattern ? new RegExp(wrapAttributesPattern) : null;
    this.codeInterpolationOptions = {
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
  get computedIndent() {
    switch (this.previousToken?.type) {
      case "newline":
      case "outdent": {
        return this.indentString.repeat(this.indentLevel);
      }
      case "indent": {
        return this.indentString;
      }
      case "start-pug-interpolation": {
        return "";
      }
    }
    return this.options.pugSingleFileComponentIndentation ? this.indentString : "";
  }
  get previousToken() {
    return this.tokens[this.currentIndex - 1];
  }
  get nextToken() {
    return this.tokens[this.currentIndex + 1];
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
    this.currentIndex++;
    return this.tokens[this.currentIndex] ?? null;
  }
  quoteString(val) {
    return `${this.quotes}${val}${this.quotes}`;
  }
  checkTokenType(token, possibilities, invert = false) {
    return !!token && possibilities.includes(token.type) !== invert;
  }
  tokenNeedsSeparator(token) {
    return this.neverUseAttributeSeparator
      ? false
      : this.alwaysUseAttributeSeparator || /^([(:[]).*/.test(token.name);
  }
  getUnformattedContentLines(firstToken, lastToken) {
    const { start } = firstToken.loc;
    const { end } = lastToken.loc;
    const lines = this.content.split(/\r\n|\n|\r/);
    const startLine = start.line - 1;
    const endLine = end.line - 1;
    const parts = [];
    const firstLine = lines[startLine];
    if (firstLine !== undefined) {
      parts.push(firstLine.slice(start.column - 1));
    }
    for (let lineNumber = startLine + 1; lineNumber < endLine; lineNumber++) {
      const line = lines[lineNumber];
      if (line !== undefined) {
        parts.push(line);
      }
    }
    const lastLine = lines[endLine];
    if (lastLine !== undefined) {
      parts.push(lastLine.slice(0, end.column - 1));
    }
    return parts;
  }
  replaceTagWithLiteralIfPossible(search, replace) {
    if (this.options.pugExplicitDiv) {
      return;
    }
    const currentTagEnd = Math.max(this.possibleIdPosition, this.possibleClassPosition);
    const tag = this.result.slice(this.currentTagPosition, currentTagEnd);
    const replaced = tag.replace(search, replace);
    if (replaced !== tag) {
      const prefix = this.result.slice(0, this.currentTagPosition);
      const suffix = this.result.slice(currentTagEnd);
      this.result = `${prefix}${replaced}${suffix}`;
      // tag was replaced, so adjust possible positions as well
      const diff = tag.length - replaced.length;
      this.possibleIdPosition -= diff;
      this.possibleClassPosition -= diff;
    }
  }
  async frameworkFormat(code) {
    const options = {
      ...this.codeInterpolationOptions,
      // we need to keep the original singleQuote option
      // see https://github.com/prettier/plugin-pug/issues/339
      singleQuote: this.options.singleQuote,
    };
    switch (this.framework) {
      case "angular": {
        options.parser = "__ng_interpolation";
        break;
      }
      case "svelte":
      case "vue":
      default: {
        options.parser = "babel";
        options.semi = false;
      }
    }
    let result = await format(code, options);
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
        const start2 = text.indexOf("{");
        if (this.options.pugFramework === "svelte" && start2 !== -1) {
          result += text.slice(0, start2);
          text = text.slice(start2 + 1);
          const end2 = text.indexOf("}");
          if (end2 === -1) {
            result += "{";
            result += text;
            text = "";
          } else {
            let code = text.slice(0, end2);
            try {
              const dangerousQuoteCombination = detectDangerousQuoteCombination(
                code,
                this.quotes,
                this.otherQuotes,
                logger,
              );
              if (dangerousQuoteCombination) {
                logger.warn(
                  "The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:",
                  code,
                );
                result += handleBracketSpacing(this.options.pugBracketSpacing, code);
                text = text.slice(end2 + 1);
                continue;
              } else {
                code = await this.frameworkFormat(code);
              }
            } catch (error) {
              logger.warn("[PugPrinter:formatText]: ", error);
              try {
                code = await format(code, {
                  parser: "babel",
                  ...this.codeInterpolationOptions,
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
            text = text.slice(end2 + 1);
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
            const dangerousQuoteCombination = detectDangerousQuoteCombination(
              code,
              this.quotes,
              this.otherQuotes,
              logger,
            );
            if (dangerousQuoteCombination) {
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
                ...this.codeInterpolationOptions,
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
  async formatDelegatePrettier(val, parser, formatOptions = {}) {
    const { trimTrailingSemicolon = false, trimLeadingSemicolon = true } = formatOptions;
    const options = { ...this.codeInterpolationOptions };
    const originalVal = val;
    val = val.trim();
    const wasQuoted = isQuoted(val);
    if (wasQuoted) {
      options.singleQuote = !this.options.pugSingleQuote;
      val = val.slice(1, -1); // Remove quotes
    }
    try {
      val = await format(val, { parser, ...options });
      val = unwrapLineFeeds(val);
      if (trimTrailingSemicolon && val.at(-1) === ";") {
        val = val.slice(0, -1);
      }
      if (trimLeadingSemicolon && val[0] === ";") {
        val = val.slice(1);
      }
      if (wasQuoted) {
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
      return originalVal;
    }
  }
  async formatStyleAttribute(val) {
    return this.formatDelegatePrettier(val, "css", {
      trimTrailingSemicolon: true,
    });
  }
  async formatVueEventBinding(val) {
    try {
      return await this.formatDelegatePrettier(val, "__vue_event_binding", {
        trimTrailingSemicolon: true,
      });
    } catch {
      return this.formatVueTsEventBinding(val);
    }
  }
  async formatVueTsEventBinding(val) {
    return this.formatDelegatePrettier(val, "__vue_ts_event_binding", {
      trimTrailingSemicolon: true,
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
  async formatFrameworkInterpolation(
    val,
    parser, // TODO: may be changed to allow a special parser for svelte
    [opening, closing],
  ) {
    val = val.slice(1, -1); // Remove quotes
    val = val.slice(opening.length, -closing.length); // Remove braces
    val = val.trim();
    if (val.includes(`\\${this.otherQuotes}`)) {
      logger.warn(
        "The following expression could not be formatted correctly. Please try to fix it yourself and if there is a problem, please open a bug issue:",
        val,
      );
    } else {
      const options = {
        ...this.codeInterpolationOptions,
        singleQuote: !this.options.pugSingleQuote,
      };
      try {
        val = await format(val, { parser, ...options });
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
    return this.formatFrameworkInterpolation(val, "__ng_interpolation", ["{{", "}}"]);
  }
  async formatSvelteInterpolation(val) {
    const wasQuoted = isQuoted(val);
    if (wasQuoted) {
      val = val.slice(1, -1); // Remove quotes
    }
    const opening = "{";
    const closing = "}";
    val = val.slice(opening.length, -closing.length); // Remove braces
    val = val.trim();
    // Since there's no svelte-attribute-expression parser in Prettier,
    // we might try to format it as JS if it looks like one, or just keep it.
    try {
      // Try formatting as JS expression
      const formatted = await format(val, {
        parser: "__js_expression",
        ...this.codeInterpolationOptions,
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
      this.nextToken &&
      ((this.nextToken.type === "class" && this.options.pugClassLocation === "before-attributes") ||
        this.nextToken.type === "id")
    ) {
      val = "";
    }
    this.currentLineLength += val.length;
    const result = `${this.computedIndent}${val}`;
    logger.debug(
      "tag",
      { result, val: token.val, length: token.val.length },
      this.currentLineLength,
    );
    this.currentTagPosition = this.result.length + this.computedIndent.length;
    this.possibleIdPosition = this.result.length + result.length;
    this.possibleClassPosition = this.result.length + result.length;
    return result;
  }
  ["start-attributes"](token) {
    let result = "";
    if (this.nextToken?.type === "attribute") {
      this.previousAttributeRemapped = false;
      this.possibleClassPosition = this.result.length;
      result = "(";
      logger.debug(this.currentLineLength);
      let tempToken = this.nextToken;
      let tempIndex = this.currentIndex + 1;
      // In pug, tags can have two kind of attributes: normal attributes that appear between parentheses,
      // and literals for ids and classes, prefixing the parentheses, e.g.: `#id.class(attribute="value")`
      // https://pugjs.org/language/attributes.html#class-literal
      // https://pugjs.org/language/attributes.html#id-literal
      // In the stream of attribute tokens, distinguish those that can be converted to literals,
      // and count those that cannot (normal attributes) to determine the resulting line length correctly.
      let hasLiteralAttributes = false;
      let numNormalAttributes = 0;
      while (tempToken.type === "attribute") {
        if (
          !this.currentlyInPugInterpolation &&
          !this.wrapAttributes &&
          this.wrapAttributesPattern?.test(tempToken.name)
        ) {
          this.wrapAttributes = true;
        }
        switch (tempToken.name) {
          case "class":
          case "id": {
            // If classes or IDs are defined as attributes and not converted to literals, count them toward attribute wrapping.
            if (
              (tempToken.name === "class" && this.options.pugClassNotation !== "literal") ||
              (tempToken.name === "id" && this.options.pugIdNotation !== "literal")
            ) {
              numNormalAttributes++;
            }
            hasLiteralAttributes = true;
            const val = tempToken.val.toString();
            if (isQuoted(val)) {
              this.currentLineLength -= 2;
            }
            this.currentLineLength += 1 + val.length;
            logger.debug(
              {
                tokenName: tempToken.name,
                length: tempToken.name.length,
              },
              this.currentLineLength,
            );
            break;
          }
          default: {
            this.currentLineLength += tempToken.name.length;
            if (numNormalAttributes > 0) {
              // This isn't the first normal attribute that will appear between parentheses,
              // add space and separator
              this.currentLineLength += 1;
              if (this.tokenNeedsSeparator(tempToken)) {
                this.currentLineLength += 1;
              }
            }
            logger.debug(
              {
                tokenName: tempToken.name,
                length: tempToken.name.length,
              },
              this.currentLineLength,
            );
            const val = tempToken.val.toString();
            if (val.length > 0 && val !== "true") {
              this.currentLineLength += 1 + val.length;
              logger.debug({ tokenVal: val, length: val.length }, this.currentLineLength);
            }
            numNormalAttributes++;
            break;
          }
        }
        tempToken = this.tokens[++tempIndex];
      }
      logger.debug("after token", this.currentLineLength);
      if (
        hasLiteralAttributes && // Remove div as it will be replaced with the literal for id and/or class
        this.previousToken?.type === "tag" &&
        this.previousToken.val === "div" &&
        !this.options.pugExplicitDiv
      ) {
        this.currentLineLength -= 3;
      }
      if (numNormalAttributes > 0) {
        // Add leading and trailing parentheses
        this.currentLineLength += 2;
      }
      if (this.options.pugClassLocation === "after-attributes") {
        let tempClassIndex = tempIndex;
        let tempClassToken = this.tokens[++tempClassIndex];
        while (tempClassToken.type === "class") {
          const val = tempClassToken.val;
          // Add leading . for classes
          this.currentLineLength += 1 + val.length;
          logger.debug({ tokenVal: val, length: val.length }, this.currentLineLength);
          tempClassToken = this.tokens[++tempClassIndex];
        }
      }
      logger.debug("final line length", {
        currentLineLength: this.currentLineLength,
      });
      if (
        !this.currentlyInPugInterpolation &&
        !this.wrapAttributes &&
        (this.currentLineLength > this.options.pugPrintWidth ||
          (this.options.pugWrapAttributesThreshold >= 0 &&
            numNormalAttributes > this.options.pugWrapAttributesThreshold))
      ) {
        this.wrapAttributes = true;
      }
      if (
        this.options.pugSortAttributes !== "as-is" ||
        this.options.pugSortAttributesEnd.length > 0 ||
        this.options.pugSortAttributesBeginning.length > 0
      ) {
        const startAttributesIndex = this.tokens.indexOf(token);
        const endAttributesIndex = tempIndex;
        if (endAttributesIndex - startAttributesIndex > 2) {
          this.tokens = partialSort(
            this.tokens,
            startAttributesIndex + 1,
            endAttributesIndex,
            (a, b) =>
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
        const val = token.val.slice(1, -1).trim();
        const classes = val.split(/\s+/);
        const specialClasses = [];
        const normalClasses = [];
        const validClassNameRegex = /^-?[A-Z_a-z]+[\w-]*$/;
        for (const className of classes) {
          if (validClassNameRegex.test(className)) {
            if (this.options.pugClassLocation === "after-attributes") {
              this.classLiteralAfterAttributes.push(className);
            } else {
              normalClasses.push(className);
            }
          } else {
            specialClasses.push(className);
          }
        }
        if (normalClasses.length > 0) {
          // Write css-class in front of attributes
          const position = this.possibleClassPosition;
          this.result = [
            this.result.slice(0, position),
            ".",
            normalClasses.join("."),
            this.result.slice(position),
          ].join("");
          this.possibleClassPosition += 1 + normalClasses.join(".").length;
          if (this.options.pugClassLocation === "before-attributes") {
            this.replaceTagWithLiteralIfPossible(/div\./, ".");
          }
        }
        if (specialClasses.length > 0) {
          token.val = makeString(specialClasses.join(" "), this.quotes);
          this.previousAttributeRemapped = false;
        } else {
          this.previousAttributeRemapped = true;
          return;
        }
      } else if (token.name === "id" && this.options.pugIdNotation !== "as-is") {
        // Handle id attribute
        let val = token.val;
        val = val.slice(1, -1);
        val = val.trim();
        const validIdNameRegex = /^-?[A-Z_a-z]+[\w-]*$/;
        if (!validIdNameRegex.test(val)) {
          val = makeString(val, this.quotes);
          this.result += "id";
          if (!token.mustEscape) {
            this.result += "!";
          }
          this.result += `=${val}`;
          return;
        }
        // Write css-id in front of css-classes
        const position = this.possibleIdPosition;
        const literal = `#${val}`;
        this.result = [this.result.slice(0, position), literal, this.result.slice(position)].join(
          "",
        );
        this.possibleClassPosition += literal.length;
        this.replaceTagWithLiteralIfPossible(/div#/, "#");
        this.previousAttributeRemapped = true;
        return;
      }
    }
    const hasNormalPreviousToken = previousNormalAttributeToken(this.tokens, this.currentIndex);
    if (
      this.previousToken?.type === "attribute" &&
      (!this.previousAttributeRemapped || hasNormalPreviousToken)
    ) {
      if (this.tokenNeedsSeparator(token)) {
        this.result += ",";
      }
      if (!this.wrapAttributes) {
        this.result += " ";
      }
    }
    this.previousAttributeRemapped = false;
    if (this.wrapAttributes) {
      this.result += "\n";
      this.result += this.indentString.repeat(this.indentLevel + 1);
    }
    this.result += token.name;
    if (typeof token.val === "boolean") {
      if (!token.val) {
        this.result += `=${token.val}`;
      }
    } else if (token.name === "class" && this.options.pugClassNotation === "attribute") {
      const val = isQuoted(token.val) ? token.val.slice(1, -1).trim() : token.val;
      const classes = val.split(/\s+/);
      if (this.classLiteralToAttribute.length > 0) {
        for (let i = this.classLiteralToAttribute.length - 1; i > -1; i--) {
          const className = this.classLiteralToAttribute.splice(i, 1)[0];
          if (className) {
            classes.unshift(className);
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
        const rightTrimmedVal = val.trimEnd();
        if (isQuoted(rightTrimmedVal)) {
          val = makeString(rightTrimmedVal.slice(1, -1), this.quotes);
        } else if (val === "true") {
          // The value is exactly true and is not quoted
          return;
        } else if (token.mustEscape) {
          val = await format(val, {
            parser: "__js_expression",
            ...this.codeInterpolationOptions,
            singleQuote: !this.options.pugSingleQuote,
          });
          const lines = val.split("\n");
          const codeIndentLevel = this.wrapAttributes ? this.indentLevel + 1 : this.indentLevel;
          if (lines.length > 1) {
            val = lines[0] ?? "";
            for (let index = 1; index < lines.length; index++) {
              val += "\n";
              val += this.indentString.repeat(codeIndentLevel);
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
  ["end-attributes"](token) {
    if (this.wrapAttributes && this.result.at(-1) !== "(") {
      if (!this.options.pugBracketSameLine) {
        this.result += "\n";
      }
      this.result += this.indentString.repeat(
        this.indentLevel + this.options.pugClosingBracketIndentDepth,
      );
    }
    this.wrapAttributes = false;
    if (this.classLiteralToAttribute.length > 0) {
      if (this.previousToken?.type === "start-attributes") {
        this.result += "(";
      } else if (this.previousToken?.type === "attribute") {
        this.result += " ";
      }
      const classes = this.classLiteralToAttribute.splice(0);
      this.result += `class=${this.quoteString(classes.join(" "))}`;
      if (this.previousToken?.type === "start-attributes") {
        this.result += ")";
      }
    }
    if (this.result.at(-1) === "(") {
      // There were no attributes
      this.result = this.result.slice(0, -1);
    } else if (this.previousToken?.type === "attribute") {
      if (this.options.pugBracketSameLine) {
        this.result = this.result.trimEnd();
      }
      this.result += ")";
    } else if (
      this.options.pugPreserveAttributeBrackets &&
      this.previousToken?.type === "start-attributes"
    ) {
      this.result += "()";
    }
    if (this.result.at(-1) === ")" && this.classLiteralAfterAttributes.length > 0) {
      const classes = this.classLiteralAfterAttributes.splice(0);
      this.result += `.${classes.join(".")}`;
    }
    if (this.options.pugClassLocation === "after-attributes") {
      this.possibleClassPosition = this.result.length;
    }
    if (this.nextToken?.type === "text" || this.nextToken?.type === "path") {
      this.result += " ";
    }
  }
  indent(token) {
    const result = `\n${this.indentString.repeat(this.indentLevel)}`;
    this.indentLevel++;
    this.currentLineLength = result.length - 1 + 1 + this.options.pugTabWidth; // -1 for \n, +1 for non zero based
    logger.debug(
      "indent",
      {
        result,
        indentLevel: this.indentLevel,
        pugTabWidth: this.options.pugTabWidth,
      },
      this.currentLineLength,
    );
    return result;
  }
  outdent(token) {
    let result = "";
    if (this.previousToken && this.previousToken.type !== "outdent") {
      if (token.loc.start.line - this.previousToken.loc.end.line > 1) {
        // Insert one extra blank line
        result += "\n";
      }
      result += "\n";
    }
    this.indentLevel--;
    this.currentLineLength = 1 + this.indentString.repeat(this.indentLevel).length; // -1 for \n, +1 for non zero based
    logger.debug("outdent", { result, indentLevel: this.indentLevel }, this.currentLineLength);
    return result;
  }
  class(token) {
    if (this.options.pugClassNotation === "attribute") {
      this.classLiteralToAttribute.push(token.val);
      // An extra div should be printed if...
      if (
        this.previousToken === undefined ||
        // ...the previous token indicates that this was the first class literal and thus a div did not previously exist...
        this.checkTokenType(this.previousToken, ["tag", "class", "end-attributes"], true) ||
        // ...OR the previous token is a div that will be removed because of the no explicit divs rule.
        (this.previousToken.type === "tag" &&
          this.previousToken.val === "div" &&
          this.nextToken?.type !== "attribute" &&
          !this.options.pugExplicitDiv)
      ) {
        this.result += `${this.computedIndent}div`;
      }
      if (
        this.checkTokenType(this.nextToken, ["text", "newline", "indent", "outdent", "eos", ":"])
      ) {
        // Copy and clear the class literals list.
        const classes = this.classLiteralToAttribute.splice(0);
        // If the last result character was a )...
        if (this.result.at(-1) === ")") {
          // Look for 'class=' that is before the last '('...
          const attributesStartIndex = this.result.lastIndexOf("(");
          const lastClassIndex = this.result.indexOf("class=", attributesStartIndex);
          // If a 'class=' is found...
          // eslint-disable-next-line unicorn/prefer-ternary, unicorn/consistent-existence-index-check -- This is more readable without ternaries.
          if (lastClassIndex > -1) {
            // ...then insert the new class into it.
            this.result = [
              this.result.slice(0, lastClassIndex + 7),
              classes.join(" "),
              " ",
              this.result.slice(lastClassIndex + 7),
            ].join("");
          } else {
            // ...otherwise add a new class attribute into the existing attributes.
            this.result =
              this.result.slice(0, -1) +
              `${this.neverUseAttributeSeparator ? " " : ", "}class=${this.quoteString(classes.join(" "))})`;
          }
          // ...or if the element has no attributes...
        } else {
          // Start a new attribute list with the class attribute in it.
          this.result += `(class=${this.quoteString(classes.join(" "))})`;
        }
        if (this.nextToken?.type === "text") {
          this.result += " ";
        }
      }
    } else {
      const val = `.${token.val}`;
      this.currentLineLength += val.length;
      logger.debug(
        "before class",
        {
          result: this.result,
          val,
          length: val.length,
          previousToken: this.previousToken,
        },
        this.currentLineLength,
      );
      switch (this.previousToken?.type) {
        case undefined:
        case "newline":
        case "outdent":
        case "indent": {
          const optionalDiv =
            this.options.pugExplicitDiv || this.options.pugClassLocation === "after-attributes"
              ? "div"
              : "";
          let result = `${this.computedIndent}${optionalDiv}`;
          if (this.options.pugClassLocation === "after-attributes") {
            this.classLiteralAfterAttributes.push(val.slice(1));
          } else {
            result += val;
          }
          this.currentLineLength += optionalDiv.length;
          this.possibleIdPosition =
            this.result.length + this.computedIndent.length + optionalDiv.length;
          this.result += result;
          this.possibleClassPosition = this.result.length;
          break;
        }
        case "end-attributes": {
          const prefix = this.result.slice(0, this.possibleClassPosition);
          this.result = [prefix, val, this.result.slice(this.possibleClassPosition)].join("");
          this.possibleClassPosition += val.length;
          break;
        }
        default: {
          if (this.options.pugClassLocation === "after-attributes") {
            this.classLiteralAfterAttributes.push(val.slice(1));
          } else {
            const prefix = this.result.slice(0, this.possibleClassPosition);
            this.result = [prefix, val, this.result.slice(this.possibleClassPosition)].join("");
            this.possibleClassPosition += val.length;
          }
          break;
        }
      }
      if (
        this.options.pugClassLocation === "after-attributes" &&
        this.classLiteralAfterAttributes.length > 0
      ) {
        let result = this.result.slice(0, this.possibleClassPosition);
        if (
          ["text", "newline", "indent", "outdent", "eos", "code", ":", undefined].includes(
            this.nextToken?.type,
          )
        ) {
          const classes = this.classLiteralAfterAttributes.splice(0);
          result += "." + classes.join(".");
        }
        this.result = [result, this.result.slice(this.possibleClassPosition)].join("");
        this.possibleClassPosition = this.result.length;
        this.replaceTagWithLiteralIfPossible(/div\./, ".");
      }
      logger.debug(
        "after class",
        { result: this.result, val, length: val.length },
        this.currentLineLength,
      );
      if (this.nextToken?.type === "text" && !/^\s+$/.test(this.nextToken.val)) {
        this.currentLineLength += 1;
        this.result += " ";
      }
    }
  }
  eos(token) {
    // Remove all newlines at the end
    while (this.result.at(-1) === "\n") {
      this.result = this.result.slice(0, -1);
    }
    // Insert one newline
    this.result += "\n";
  }
  comment(commentToken) {
    let result = this.computedIndent;
    // See if this is a `//- prettier-ignore` comment, which would indicate that the part of the template
    // that follows should be left unformatted. Support the same format as typescript-eslint is using for descriptions:
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/ban-ts-comment.md#allow-with-description
    if (/^ prettier-ignore($|[ :])/.test(commentToken.val)) {
      // Use a separate token processing loop to find the end of the stream of tokens to be ignored by formatting,
      // and uses their `loc` properties to retrieve the original pug code to be used instead.
      let token = this.getNextToken();
      if (token) {
        let skipNewline = token.type === "newline";
        let ignoreLevel = 0;
        while (token) {
          const { type } = token;
          if (type === "newline" && ignoreLevel === 0) {
            // Skip first newline after `prettier-ignore` comment
            if (skipNewline) {
              skipNewline = false;
            } else {
              break;
            }
          }
          // eslint-disable-next-line unicorn/prefer-switch
          else if (type === "indent") {
            ignoreLevel++;
          } else if (type === "outdent") {
            ignoreLevel--;
            if (ignoreLevel <= 0) {
              if (ignoreLevel < 0) {
                this.indentLevel--;
              }
              break;
            }
          } else if (type === "eos") {
            break;
          }
          token = this.getNextToken();
        }
        if (token) {
          const lines = this.getUnformattedContentLines(commentToken, token);
          // Trim the last line, since indentation of formatted pug is handled separately.
          const lastLine = lines.pop();
          if (lastLine !== undefined) {
            lines.push(lastLine.trimEnd());
          }
          result += lines.join("\n");
          if (token.type === "eos") {
            result += "\n";
          }
        }
      }
    } else {
      if (this.checkTokenType(this.previousToken, ["newline", "indent", "outdent"], true)) {
        result += " ";
      }
      result += "//";
      if (!commentToken.buffer) {
        result += "-";
      }
      result += formatPugCommentPreserveSpaces(
        commentToken.val,
        this.options.pugCommentPreserveSpaces,
      );
      if (this.nextToken?.type === "start-pipeless-text") {
        this.pipelessComment = true;
      }
    }
    return result;
  }
  newline(token) {
    let result = "";
    if (this.previousToken && token.loc.start.line - this.previousToken.loc.end.line > 1) {
      // Insert one extra blank line
      result += "\n";
    }
    result += "\n";
    this.currentLineLength = 1 + this.indentString.repeat(this.indentLevel).length; // -1 for \n, +1 for non zero based
    logger.debug("newline", { result, indentLevel: this.indentLevel }, this.currentLineLength);
    return result;
  }
  async text(token) {
    let result = "";
    let val = token.val;
    let needsTrailingWhitespace = false;
    let endsWithWhitespace = val.at(-1) === " " && !/^\s+$/.test(val);
    if (this.pipelessText) {
      switch (this.previousToken?.type) {
        case "newline": {
          if (val.trim().length > 0) {
            result += this.indentString.repeat(this.indentLevel + 1);
          }
          break;
        }
        case "start-pipeless-text": {
          result += this.indentString;
          break;
        }
      }
      if (this.pipelessComment) {
        val = formatPugCommentPreserveSpaces(val, this.options.pugCommentPreserveSpaces, true);
      }
    } else {
      if (this.nextToken && endsWithWhitespace) {
        switch (this.nextToken.type) {
          case "interpolated-code":
          case "start-pug-interpolation": {
            needsTrailingWhitespace = true;
            break;
          }
        }
      }
      val = val.replaceAll(/\s\s+/g, " ");
      switch (this.previousToken?.type) {
        case "newline": {
          result += this.indentString.repeat(this.indentLevel);
          if (this.options.pugPreserveWhitespace && /^ .+$/.test(val)) {
            result += "|\n";
            result += this.indentString.repeat(this.indentLevel);
          }
          result += "|";
          if (/.*\S.*/.test(token.val) || this.nextToken?.type === "start-pug-interpolation") {
            result += " ";
          }
          break;
        }
        case "indent":
        case "outdent": {
          result += this.computedIndent;
          if (this.options.pugPreserveWhitespace && /^ .+$/.test(val)) {
            result += "|\n";
            result += this.indentString.repeat(this.indentLevel);
          }
          result += "|";
          if (/.*\S.*/.test(token.val) || this.nextToken?.type === "start-pug-interpolation") {
            result += " ";
          }
          break;
        }
        case "interpolated-code":
        case "end-pug-interpolation": {
          if (/^ .+$/.test(val) || val === " ") {
            result += " ";
          } else if (/^.+ $/.test(val)) {
            needsTrailingWhitespace = true;
          }
          break;
        }
      }
      val = val.trim();
      val = await this.formatText(val);
      val = val.replaceAll(/#([[{])/g, "\\#$1");
    }
    if (
      this.checkTokenType(this.previousToken, [
        "tag",
        "id",
        "interpolation",
        "call",
        "&attributes",
        "filter",
      ])
    ) {
      if (val.length === 0 && this.nextToken?.type === "indent") {
        endsWithWhitespace = false;
      } else {
        val = ` ${val}`;
      }
    }
    result += val;
    if (needsTrailingWhitespace) {
      result += " ";
    }
    if (endsWithWhitespace && this.nextToken?.type === "indent") {
      result += "\n" + this.indentString.repeat(this.indentLevel + 1) + "|";
    }
    return result;
  }
  ["interpolated-code"](token) {
    let result = "";
    switch (this.previousToken?.type) {
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
        result = this.computedIndent;
        result += this.pipelessText ? this.indentString : "| ";
        break;
      }
    }
    result += token.mustEscape ? "#" : "!";
    result += handleBracketSpacing(this.options.pugBracketSpacing, token.val.trim(), ["{", "}"]);
    return result;
  }
  async formatRawCode(val, useSemi) {
    val = await format(val, {
      parser: "babel",
      ...this.codeInterpolationOptions,
      semi: useSemi,
      // Always pass endOfLine 'lf' here to be sure that the next `val.slice(0, -1)` call is always working
      endOfLine: "lf",
    });
    return val.slice(0, -1);
  }
  async formatRawCodeWithFallbackNoElse(val, useSemi) {
    try {
      return await this.formatRawCode(val, useSemi);
    } catch (error) {
      if (!(error instanceof SyntaxError)) throw error;
      const m = /Unexpected token \(1:(\d+)\)/.exec(error.message);
      const n = Number(m?.[1]);
      // If the error is not from the very end of the code, then this fallback approach won't work, so we throw the original error.
      if (val.length + 1 !== n) throw error;
      // At this point, we know the SyntaxError is from the fact that there's no statement after our val's statement, implying we likely need a block after it. Using an empty block to get babel to parse it without affecting the code semantics.
      // Example: `if (foo)` is not valid JS on its own, but `if (foo) {}` is.
      try {
        // Look for comments at the end of the line, since we have to insert the block in between the statement and the comment or else the block will potentially be commented out
        const commentIndex = val.search(/\/(?:\/|\*).*$/);
        if (commentIndex === -1) {
          val += "{}";
        } else {
          val = `${val.slice(0, commentIndex)}{}${val.slice(commentIndex)}`;
        }
        val = await this.formatRawCode(val, useSemi);
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
      } catch (secondError) {
        logger.debug("[PugPrinter] fallback format error", secondError);
        // throw original error since our fallback didn't work
        throw error;
      }
    }
  }
  // Since every line is parsed independently, babel will throw a SyntaxError if the line of code is only valid when there is another statement after it, or if the line starts with `else if` or `else`. This is a hack to get babel to properly parse what would otherwise be an invalid standalone JS line (e.g., `if (foo)`, `else if (bar)`, `else`)
  async formatRawCodeWithFallback(val, useSemi) {
    if (val.startsWith("else")) {
      // If the code starts with `else`, then we can format the code without the `else` keyword, and then add it back onto the start.
      // We can call the same helper function in each case, just with different inputs, so we can easily handle all `if`, `else if`, and `else` cases without having to write out each one.
      const noElse = await this.formatRawCodeWithFallbackNoElse(val.slice(4), useSemi);
      // `noElse` will either be an empty string or it will contain a comment. Now we just prepend `else` onto the start and trim in case `noElse` is empty
      return `else ${noElse}`.trim();
    } else {
      return await this.formatRawCodeWithFallbackNoElse(val, useSemi);
    }
  }
  async code(token) {
    let result = this.computedIndent;
    if (!token.mustEscape && token.buffer) {
      result += "!";
    }
    result += token.buffer ? "=" : "-";
    let useSemi = this.options.pugSemi;
    if (useSemi && (token.mustEscape || token.buffer)) {
      useSemi = false;
    }
    let val = token.val;
    try {
      const valBackup = val;
      val = await this.formatRawCodeWithFallback(val, useSemi);
      if (val[0] === ";") {
        val = val.slice(1);
      }
      if (val.includes("\n")) {
        val = valBackup;
      }
    } catch (error) {
      logger.warn("[PugPrinter]:", error);
    }
    result += ` ${val}`;
    return result;
  }
  id(token) {
    const val = `#${token.val}`;
    this.currentLineLength += val.length;
    switch (this.previousToken?.type) {
      case undefined:
      case "newline":
      case "outdent":
      case "indent": {
        const optionalDiv = this.options.pugExplicitDiv ? "div" : "";
        const result = `${this.computedIndent}${optionalDiv}${val}`;
        this.currentLineLength += optionalDiv.length;
        this.result += result;
        this.possibleClassPosition = this.result.length;
        break;
      }
      default: {
        const prefix = this.result.slice(0, this.possibleIdPosition);
        this.possibleClassPosition += val.length;
        this.result = [prefix, val, this.result.slice(this.possibleIdPosition)].join("");
        break;
      }
    }
  }
  async ["start-pipeless-text"](token) {
    this.pipelessText = true;
    let result = `\n${this.indentString.repeat(this.indentLevel)}`;
    if (this.previousToken?.type === "dot") {
      const lastTagToken = previousTagToken(this.tokens, this.currentIndex);
      let parser;
      switch (lastTagToken?.val) {
        case "script": {
          parser = getScriptParserName(previousTypeAttributeToken(this.tokens, this.currentIndex));
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
        let index = this.currentIndex + 1;
        let tok = this.tokens[index];
        let rawText = "";
        let usedInterpolatedCode = false;
        while (tok && tok.type !== "end-pipeless-text") {
          switch (tok.type) {
            case "text": {
              rawText += tok.val;
              break;
            }
            case "newline": {
              rawText += "\n";
              break;
            }
            case "interpolated-code": {
              usedInterpolatedCode = true;
              rawText += tok.mustEscape ? "#" : "!";
              rawText += `{${tok.val}}`;
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
          index++;
          tok = this.tokens[index];
        }
        try {
          result = await format(rawText, {
            parser,
            ...this.codeInterpolationOptions,
          });
        } catch (error) {
          if (!usedInterpolatedCode) {
            logger.error(error);
            throw error;
          }
          // Continue without formatting the content
          const warningContext = [
            "[PugPrinter:start-pipeless-text]:",
            "The following expression could not be formatted correctly.",
            "This is likely a syntax error or an issue caused by the missing execution context.",
            "If you think this is a bug, please open a bug issue.",
          ];
          // TODO: If other token types occur use `if (usedInterpolatedCode)`
          // eslint-disable-next-line unicorn/no-immediate-mutation
          warningContext.push(
            `\ncode: \`${rawText.trim()}\``,
            "\nYou used interpolated code in your pipeless script tag, so you may ignore this warning.",
          );
          if (types.isNativeError(error)) {
            warningContext.push(`\nFound ${parser} ${error.name}: ${error.message}.`);
          } else {
            logger.debug("typeof error:", typeof error);
            warningContext.push(`\nUnexpected error for parser ${parser}.`, error);
          }
          logger.warn(...warningContext);
          result = rawText;
        }
        result = result.trimEnd();
        const indentString = this.indentString.repeat(this.indentLevel + 1);
        result = result
          .split("\n")
          .map((line) => (line ? indentString + line : ""))
          .join("\n");
        result = `\n${result}`;
        // Preserve newline
        tok = this.tokens[index - 1];
        if (tok?.type === "text" && tok.val === "") {
          result += "\n";
        }
        this.currentIndex = index - 1;
      }
    }
    return result;
  }
  ["end-pipeless-text"](token) {
    this.pipelessText = false;
    this.pipelessComment = false;
    return "";
  }
  doctype(token) {
    let result = `${this.computedIndent}doctype`;
    if (token.val) {
      result += ` ${token.val}`;
    }
    return result;
  }
  dot(token) {
    return ".";
  }
  block(token) {
    let result = `${this.computedIndent}block `;
    if (token.mode !== "replace") {
      result += `${token.mode} `;
    }
    result += token.val;
    return result;
  }
  extends(token) {
    const indent = this.options.pugSingleFileComponentIndentation ? this.indentString : "";
    return `${indent}extends `;
  }
  path(token) {
    let result = "";
    if (this.checkTokenType(this.previousToken, ["include", "filter"])) {
      result += " ";
    }
    result += token.val;
    return result;
  }
  ["start-pug-interpolation"](token) {
    let result = "";
    if (
      this.pipelessText &&
      this.tokens[this.currentIndex - 2]?.type === "newline" &&
      this.previousToken?.type === "text" &&
      this.previousToken.val.trim().length === 0
    ) {
      result += this.indentString.repeat(this.indentLevel + 1);
    }
    this.currentlyInPugInterpolation = true;
    result += "#[";
    return result;
  }
  ["end-pug-interpolation"](token) {
    this.currentlyInPugInterpolation = false;
    return "]";
  }
  interpolation(token) {
    const result = `${this.computedIndent}#{${token.val}}`;
    this.currentLineLength += result.length;
    this.possibleIdPosition = this.result.length + result.length;
    this.possibleClassPosition = this.result.length + result.length;
    return result;
  }
  include(token) {
    return `${this.computedIndent}include`;
  }
  filter(token) {
    return `${this.computedIndent}:${token.val}`;
  }
  async call(token) {
    let result = `${this.computedIndent}+${token.val}`;
    let args = token.args;
    if (args) {
      args = args.trim().replaceAll(/\s\s+/g, " ");
      // Place an x at the beginning to preserve brackets,
      // then remove the x after format.
      args = await format(`x(${args})`, {
        parser: "babel",
        ...this.codeInterpolationOptions,
      });
      args = args.trim();
      if (args.at(-1) === ";") {
        args = args.slice(0, -1);
      }
      args = args.slice(1);
      args = unwrapLineFeeds(args);
      result += args;
    }
    this.currentLineLength += result.length;
    this.possibleIdPosition = this.result.length + result.length;
    this.possibleClassPosition = this.result.length + result.length;
    return result;
  }
  async mixin(token) {
    let result = `${this.computedIndent}mixin ${token.val}`;
    let args = token.args;
    if (args) {
      args = args.trim().replaceAll(/\s\s+/g, " ");
      // Let args act as args of js function during format.
      args = await format(`function x(${args}) {}`, {
        parser: "babel",
        ...this.codeInterpolationOptions,
      });
      args = args.trim().slice(10, -3);
      result += args;
    }
    return result;
  }
  async if(token) {
    let result = this.computedIndent;
    const match = /^!\((.*)\)$/.exec(token.val);
    logger.debug("[PugPrinter]:", match);
    let append = "if ";
    let code = token.val;
    if (match) {
      append = "unless ";
      code = match[1];
    }
    result += append;
    if (typeof code === "string") {
      code = await format(code, {
        parser: "__js_expression",
        ...this.codeInterpolationOptions,
        singleQuote: !this.options.pugSingleQuote,
      });
    }
    result += String(code).trim();
    return result;
  }
  ["mixin-block"](token) {
    return `${this.computedIndent}block`;
  }
  else(token) {
    return `${this.computedIndent}else`;
  }
  async ["&attributes"](token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
    });
    const result = `&attributes(${code})`;
    this.currentLineLength += result.length;
    return result;
  }
  ["text-html"](token) {
    const match = /^<(.*?)>(.*)<\/(.*?)>$/.exec(token.val);
    logger.debug("[PugPrinter]:", match);
    if (match) {
      return `${this.computedIndent}${match[1]} ${match[2]}`;
    }
    const entry = Object.entries(DOCTYPE_SHORTCUT_REGISTRY).find(
      ([key]) => key === token.val.toLowerCase(),
    );
    if (entry) {
      return `${this.computedIndent}${entry[1]}`;
    }
    return `${this.computedIndent}${token.val}`;
  }
  async each(token) {
    let result = `${this.computedIndent}each ${token.val}`;
    if (token.key !== null) {
      result += `, ${token.key}`;
    }
    const code = await format(token.code, {
      parser: "__js_expression",
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
    });
    result += ` in ${unwrapLineFeeds(code.trim())}`;
    return result;
  }
  async eachOf(token) {
    let value = token.value.trim();
    value = await format(value, {
      parser: "babel",
      ...this.codeInterpolationOptions,
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
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
      semi: true,
    });
    code = code.trim();
    return `${this.computedIndent}each ${value} of ${code}`;
  }
  async while(token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computedIndent}while ${code.trim()}`;
  }
  async case(token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computedIndent}case ${code.trim()}`;
  }
  async when(token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computedIndent}when ${code.trim()}`;
  }
  [":"](token) {
    this.possibleIdPosition = this.result.length + 2;
    this.possibleClassPosition = this.result.length + 2;
    return ": ";
  }
  default(token) {
    return `${this.computedIndent}default`;
  }
  async ["else-if"](token) {
    const code = await format(token.val, {
      parser: "__js_expression",
      ...this.codeInterpolationOptions,
      singleQuote: !this.options.pugSingleQuote,
    });
    return `${this.computedIndent}else if ${code.trim()}`;
  }
  blockcode(token) {
    return `${this.computedIndent}-`;
  }
  yield(token) {
    return `${this.computedIndent}yield`;
  }
  slash(token) {
    let result = "/";
    if (this.nextToken?.type === "text") {
      result += " ";
    }
    return result;
  }
}
