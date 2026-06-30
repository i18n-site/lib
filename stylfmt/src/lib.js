import parseStylus from "@3-/stylus/parse.js";
import runStylus from "@3-/stylus/run.js";
import renderStylus from "@3-/stylus/render.js";
import { format } from "stylus-supremacy";
import cssfmt from "@3-/cssfmt";
import parse from "./parse.js";

const COMMENT_RE =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\/\*[\s\S]*?\*\/|\/\/.*)/g,
  INLINE_C = "--inline-c-",
  PLACEHOLDER_C = "._c_",
  compile = (code) => renderStylus(runStylus(parseStylus(code)[2])),
  dedup = (css) => {
    let depth = 0,
      block_start = 0,
      header = "",
      last_idx = 0;

    const keyframes_map = new Map(),
      output_parts = [];

    for (let i = 0; i < css.length; ++i) {
      const char = css[i];
      if (char === "{") {
        if (depth === 0) {
          block_start = i;
          header = css.slice(last_idx, i).trim();
        }
        ++depth;
      } else if (char === "}") {
        --depth;
        if (depth === 0) {
          const block_content = css.slice(block_start, i + 1),
            match = header.match(/@keyframes\s+([a-zA-Z0-9_-]+)/);
          if (match) {
            const name = match[1];
            keyframes_map.set(name, [header, block_content]);
          } else {
            output_parts.push(header + block_content);
          }
          last_idx = i + 1;
        }
      }
    }

    if (last_idx < css.length) {
      const remaining = css.slice(last_idx).trim();
      if (remaining) {
        output_parts.push(remaining);
      }
    }

    for (const [hdr, content] of keyframes_map.values()) {
      output_parts.push(hdr + content);
    }

    return output_parts.join("\n\n");
  },
  mask = (code) => {
    const comments = [],
      lines = code.split(/\r?\n/),
      res = lines.map((line) => {
        let match;
        for (const m of line.matchAll(COMMENT_RE)) {
          if (m[0].startsWith("//") || m[0].startsWith("/*")) {
            match = m;
            break;
          }
        }
        if (match) {
          const val = match[0],
            idx = match.index,
            before = line.slice(0, idx),
            is_inline = before.trim().length > 0,
            indent = line.match(/^([ \t]*)/)[0],
            n = comments.length;
          comments.push([val, is_inline]);
          return is_inline
            ? before.trimEnd() + "\n" + indent + INLINE_C + n + ": 1"
            : indent + PLACEHOLDER_C + n + "_\n" + indent + "  --c: 1";
        }
        return line;
      });
    return [res.join("\n"), comments];
  },
  unmask = (formatted_code, comments) => {
    let result = formatted_code;
    for (let i = 0; i < comments.length; ++i) {
      const [content, is_inline] = comments[i];
      if (is_inline) {
        result = result.replace(
          new RegExp("\\r?\\n[ \\t]*" + INLINE_C + i + "(?:\\s*1|\\s*:\\s*1);?", "g"),
          " " + content,
        );
      } else {
        result = result.replace(
          new RegExp(
            "([ \\t]*)\\" +
              PLACEHOLDER_C +
              i +
              "_\\s*(?:\\{\\s*)?--c\\s*:?\\s*1[ \\t]*;?[ \\t]*(?:\\r?\\n[ \\t]*\\}|[ \\t]*\\})?",
            "g",
          ),
          (match, indent) => indent + content,
        );
      }
    }
    return result;
  };

export { parse };

export default (supremacy) => {
  const opt = parse(supremacy);
  return async (code, filename) => {
    const [clean, comments] = mask(code),
      imports = [],
      no_import = clean.replace(/@import\s+(?:url\([^)]+\)|['"][^'"]+['"])[^\r\n]*/g, (match) => {
        imports.push(match);
        return "";
      }),
      raw = compile(no_import),
      deduped = dedup(raw),
      nested = cssfmt(deduped),
      joined = (imports.length ? imports.join("\n") + "\n" : "") + nested,
      formatted = await format(joined, opt);
    return unmask(formatted, comments);
  };
};
