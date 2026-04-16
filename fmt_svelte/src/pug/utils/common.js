export const previousTagToken = (tokens, index) => {
  for (let i = index - 1; i >= 0; i--) {
    const token = tokens[i];
    if (token?.type === "tag") return token;
  }
};

export const previousNormalAttributeToken = (tokens, index) => {
  for (let i = index - 1; i > 0; i--) {
    const token = tokens[i];
    if (!token || token.type === "start-attributes") return;
    if (token.type === "attribute" && token.name !== "class" && token.name !== "id") return token;
  }
};

export const previousTypeAttributeToken = (tokens, index) => {
  for (let i = index - 1; i > 0; i--) {
    const token = tokens[i];
    if (!token || token.type === "start-attributes" || token.type === "tag") return;
    if (token.type === "attribute" && token.name === "type") return token;
  }
};

export const unwrapLineFeeds = (value) =>
  value.includes("\n")
    ? value
        .split("\n")
        .map((part) => part.trim())
        .map((part) => (part[0] === "." ? "" : " ") + part)
        .join("")
        .trim()
    : value;

export const isStyleAttribute = (name, val) => name === "style" && isQuoted(val);

export const isWrappedWith = (val, start, end, offset = 0) =>
  val.startsWith(start, offset) && val.endsWith(end, val.length - offset);

export const isQuoted = (val) => {
  if (/^(['"`])([\s\S]*)\1$/.test(val)) {
    const regex = new RegExp(`${val[0]}(?<!\\\\${val[0]})`);
    return !regex.test(val.slice(1, -1));
  }
  return false;
};

export const isSingleLineWithInterpolation = (val) =>
  /^`[\S\s]*`$/.test(val) && val.includes("${");

export const isMultilineInterpolation = (val) => /^`[\S\s]*`$/m.test(val) && val.includes("\n");

export const handleBracketSpacing = (bracket_spacing, code, [opening, closing] = ["{{", "}}"]) =>
  bracket_spacing ? `${opening} ${code} ${closing}` : `${opening}${code}${closing}`;

export const makeString = (raw_content, enclosing_quote, unescape_unnecessary_escapes = false) => {
  const other_quote = enclosing_quote === '"' ? "'" : '"',
    new_content = raw_content.replaceAll(/\\([\S\s])|(["'])/g, (match, escaped, quote) => {
      if (escaped === other_quote) return escaped;
      if (quote === enclosing_quote) return `\\${quote}`;
      if (quote) return quote;
      return unescape_unnecessary_escapes && /^[^\n\r"'0-7\\bfnrt-vx\u2028\u2029]$/.test(escaped)
        ? escaped
        : `\\${escaped}`;
    });
  return enclosing_quote + new_content + enclosing_quote;
};

export const detectDangerousQuoteCombination = (code, quotes, other_quotes, logger) => {
  const q1 = code.indexOf(quotes),
    q2 = code.indexOf(other_quotes),
    qb = code.indexOf("`");
  if (q1 >= 0 && q2 >= 0 && q2 > q1 && (qb < 0 || q1 < qb)) {
    logger.log({ code, quotes, other_quotes, q1, q2, qb });
    return true;
  }
  return false;
};

export const detectFramework = () => {
  try {
    const npm_packages = Object.keys(process.env)
      .filter((key) => key.startsWith("npm_package_"))
      .filter((key) => /(dev)?[Dd]ependencies_+/.test(key));
    if (npm_packages.some((pack) => pack.includes("vue") && !pack.includes("vuepress"))) return "vue";
    if (npm_packages.some((pack) => pack.includes("svelte"))) return "svelte";
    if (npm_packages.some((pack) => pack.includes("angular"))) return "angular";
  } catch {
    return "auto";
  }
  return "auto";
};

