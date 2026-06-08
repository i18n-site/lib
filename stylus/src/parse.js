import { all } from "known-css-properties";
import { NODE_IMPORT, NODE_VAR, NODE_PROP, NODE_RULE } from "./const.js";

const CSS_PROPERTIES = new Set(all),
  splitAt = (str, idx) => [str.slice(0, idx).trim(), str.slice(idx + 1).trim()],
  extractProp = (trimmed) => {
    const colon_idx = trimmed.indexOf(":");
    if (colon_idx > 0) {
      const [left, right] = splitAt(trimmed, colon_idx);
      if (/^[a-zA-Z-][a-zA-Z0-9-]*$/.test(left)) {
        if (!(CSS_PROPERTIES.has(left) || left.startsWith("--") || left.startsWith("-"))) {
          return [false, "", ""];
        }
        if (right.length > 0 && !right.startsWith("{")) {
          return [true, left, right.endsWith(";") ? right.slice(0, -1).trim() : right];
        }
      }
    }
    const space_idx = trimmed.search(/\s+/);
    if (space_idx > 0) {
      const [left, right] = splitAt(trimmed, space_idx);
      if (CSS_PROPERTIES.has(left) || left.startsWith("--") || left.startsWith("-")) {
        return [true, left, right];
      }
    }
    return [false, "", ""];
  },
  stripComments = (str) => {
    let in_string = false,
      quote_char = "",
      in_url = false,
      in_single_comment = false,
      in_multi_comment = false,
      result = "";
    for (let i = 0; i < str.length; ++i) {
      const char = str[i],
        next = str[i + 1];
      if (in_single_comment) {
        if (char === "\n" || char === "\r") {
          in_single_comment = false;
          result += char;
        }
        continue;
      }
      if (in_multi_comment) {
        if (char === "*" && next === "/") {
          in_multi_comment = false;
          ++i;
        } else if (char === "\n" || char === "\r") {
          result += char;
        }
        continue;
      }
      if (in_string) {
        if (char === "\\") {
          result += char + (next ?? "");
          ++i;
        } else if (char === quote_char) {
          in_string = false;
          result += char;
        } else {
          result += char;
        }
        continue;
      }
      if (in_url) {
        if (char === ")") {
          in_url = false;
        }
        result += char;
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        in_string = true;
        quote_char = char;
        result += char;
        continue;
      }
      if (char === "u" || char === "U") {
        if (str.slice(i, i + 4).toLowerCase() === "url(") {
          in_url = true;
          result += "url(";
          i += 3;
          continue;
        }
      }
      if (char === "/" && next === "/") {
        in_single_comment = true;
        ++i;
        continue;
      }
      if (char === "/" && next === "*") {
        in_multi_comment = true;
        ++i;
        continue;
      }
      result += char;
    }
    return result;
  },
  hasBraces = (content) => {
    let in_string = false,
      quote_char = "",
      in_single_comment = false,
      in_multi_comment = false;
    for (let i = 0; i < content.length; ++i) {
      const char = content[i],
        next = content[i + 1];
      if (in_single_comment) {
        if (char === "\n" || char === "\r") {
          in_single_comment = false;
        }
        continue;
      }
      if (in_multi_comment) {
        if (char === "*" && next === "/") {
          in_multi_comment = false;
          ++i;
        }
        continue;
      }
      if (in_string) {
        if (char === "\\") {
          ++i;
        } else if (char === quote_char) {
          in_string = false;
        }
        continue;
      }
      if (char === '"' || char === "'" || char === "`") {
        in_string = true;
        quote_char = char;
        continue;
      }
      if (char === "/" && next === "/") {
        in_single_comment = true;
        ++i;
        continue;
      }
      if (char === "/" && next === "*") {
        in_multi_comment = true;
        ++i;
        continue;
      }
      if (char === "{") {
        return true;
      }
    }
    return false;
  },
  parseStatement = (trimmed, parent, line_num, file_path, include_prop = false) => {
    if (trimmed.startsWith("@import") || trimmed.startsWith("@require")) {
      const match =
        trimmed.match(/@(import|require)\s+['"]([^'"]+)['"]/) ||
        trimmed.match(/@(import|require)\s+(url\([^)]+\))/);
      if (match) {
        parent[2].push([NODE_IMPORT, match[2], line_num, file_path]);
      }
      return true;
    }
    const var_match = trimmed.match(/^([a-zA-Z_-][a-zA-Z0-9_-]*)\s*=\s*(.*)$/);
    if (var_match) {
      parent[2].push([NODE_VAR, var_match[1].trim(), var_match[2].trim(), line_num, file_path]);
      return true;
    }
    if (include_prop) {
      const [is_prop, name, val] = extractProp(trimmed);
      if (is_prop) {
        parent[2].push([NODE_PROP, name, val, line_num, file_path]);
        return true;
      }
    }
    return false;
  },
  parseCss = (content, file_path) => {
    const lineNum = (index) => {
        const sub = content.slice(0, index),
          matches = sub.match(/\n/g);
        return matches ? matches.length + 1 : 1;
      },
      root = [NODE_RULE, "", [], 1, file_path],
      stack = [root];

    let current = "",
      i = 0;

    while (i < content.length) {
      const char = content[i];

      if (char === "\n") {
        const trimmed = current.trim();
        if (parseStatement(trimmed, stack[stack.length - 1], lineNum(i), file_path)) {
          current = "";
        }
        current += char;
        ++i;
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        const quote = char;
        current += char;
        ++i;
        while (i < content.length) {
          const c = content[i];
          if (c === "\\") {
            current += c + (content[i + 1] || "");
            i += 2;
          } else if (c === quote) {
            current += c;
            ++i;
            break;
          } else {
            current += c;
            ++i;
          }
        }
        continue;
      }

      if (char === "{") {
        const sel = current.replace(/\s+/g, " ").trim(),
          node = [NODE_RULE, sel, [], lineNum(i), file_path],
          parent = stack[stack.length - 1];
        parent[2].push(node);
        stack.push(node);
        current = "";
        ++i;
        continue;
      }

      if (char === "}") {
        const trimmed = current.trim();
        if (trimmed) {
          parseStatement(trimmed, stack[stack.length - 1], lineNum(i), file_path, true);
        }
        if (stack.length > 1) {
          stack.pop();
        }
        current = "";
        ++i;
        continue;
      }

      if (char === ";") {
        const trimmed = current.trim();
        if (trimmed) {
          parseStatement(trimmed, stack[stack.length - 1], lineNum(i), file_path, true);
        }
        current = "";
        ++i;
        continue;
      }

      current += char;
      ++i;
    }

    return root;
  };

export default (content, file_path) => {
  const clean_content = stripComments(content);

  if (hasBraces(clean_content)) {
    return parseCss(clean_content, file_path);
  }

  const lines = clean_content.split(/\r?\n/),
    root = [NODE_RULE, "", [], 1, file_path],
    stack = [[root, -1]];

  lines.forEach((line, idx) => {
    const line_num = idx + 1,
      trimmed = line.trim();
    if (trimmed === "") {
      return;
    }

    const indent = line.match(/^([ \t]*)/)[0].length;

    while (stack.length > 1 && stack[stack.length - 1][1] >= indent) {
      stack.pop();
    }

    const [parent] = stack[stack.length - 1];

    if (parseStatement(trimmed, parent, line_num, file_path, true)) {
      return;
    }

    const node = [NODE_RULE, trimmed, [], line_num, file_path];
    parent[2].push(node);
    stack.push([node, indent]);
  });

  return root;
};
