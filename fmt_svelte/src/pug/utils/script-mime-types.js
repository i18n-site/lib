const 
  JSON_SUFFIX_RE = /\+(json|yaml)$/i,
  WRAPPING_QUOTES_RE = /(^(["'`]))|((["'`])$)/g,
  SCRIPT_TYPE_TO_PARSER_MAP = new Map([
    ["application/ecmascript", "babel"],
    ["application/javascript", "babel"],
    ["application/json", "json"],
    ["text/ecmascript", "babel"],
    ["text/javascript", "babel"],
    ["text/markdown", "markdown"],
    ["text/typescript", "typescript"],
    ["module", "babel"],
  ]);

export const getScriptParserName = (type_attr_token) => {
  if (!type_attr_token) return "babel";
  const type_raw = type_attr_token.val;
  if (typeof type_raw !== "string") return;
  const type = type_raw.replaceAll(WRAPPING_QUOTES_RE, "");
  if (!type) return "babel";
  const suffix_exec = JSON_SUFFIX_RE.exec(type);
  if (suffix_exec) return suffix_exec[1];
  return SCRIPT_TYPE_TO_PARSER_MAP.get(type);
};

export default getScriptParserName;

