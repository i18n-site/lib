import pug from "./pug.js";
import styl from "./styl.js";
import js from "./js.js";

export default async (code, file_name = "file.svelte") => {
  let end_tag, fmt, tag, t, line_offset = 1;
  const 
    res = [], 
    errors = [],
    lines = code.split("\n");
  
  for (const [i, raw_line] of lines.entries()) {
    const 
      line = raw_line.trimEnd(),
      trim_line = line.trim();
    
    if (t) {
      if (trim_line === end_tag) {
        let content = t.join("\n");
        if (fmt) {
          if (tag === "script") {
            const [out, errs] = await fmt(content, file_name);
            content = out;
            if (errs?.length) errors.push(...errs.map(e => ({ ...e, line: (e.line || 0) + line_offset })));
          } else content = await fmt(content);
        }
        res.push(content.trim(), line);
        t = fmt = undefined;
      } else t.push(line);
    } else {
      res.push(line);
      const match = trim_line.match(/^<(\w+)(?:\s+([^>]*))?>(?!\s*<\/\1>)$/);
      if (match) {
        const current_tag = match[1].toLowerCase();
        if (["template", "style", "script"].includes(current_tag)) {
          const 
            attr_str = match[2] || "",
            lang_match = attr_str.match(/lang\s*=\s*(['"]?)([^'"\s>]+)\1/i),
            lang = lang_match ? lang_match[2].toLowerCase() : undefined;

          tag = current_tag;
          line_offset = i + 2;
          if (tag === "template" && lang === "pug") fmt = pug;
          else if (tag === "style" && ["stylus", "styl"].includes(lang)) fmt = styl;
          else if (tag === "script" && (!lang || ["js", "ts"].includes(lang))) fmt = js;

          t = [];
          end_tag = `</${tag}>`;
        }
      }
    }
  }
  if (t?.length) res.push(...t);
  return [res.join("\n").trim(), errors];
};

