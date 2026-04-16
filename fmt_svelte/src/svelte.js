import pug from "./pug.js";
import styl from "./styl.js";
import js from "./js.js";

export default async (code, filename = "file.svelte") => {
  let 
    end_tag, fmt, tag, t, 
    line_offset = 1;
  const 
    res = [], 
    errors = [],
    lines = code.split("\n");
  
  for (let i = 0; i < lines.length; i++) {
    const 
      raw_line = lines[i],
      line = raw_line.trimEnd(),
      trim_line = line.trim();
    
    if (t) {
      if (trim_line === end_tag) {
        let content = t.join("\n");
        if (fmt) {
          try {
            if (tag === "script") {
              const [out, errs] = await fmt(content, filename);
              content = out;
              if (errs?.length) errors.push(...errs.map(e => ({ ...e, line: (e.line || 0) + line_offset })));
            } else {
              content = await fmt(content);
            }
          } catch (e) {
            errors.push({ message: e.message, line: line_offset });
          }
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
          else if (tag === "style" && (lang === "stylus" || lang === "styl")) fmt = styl;
          else if (tag === "script" && (!lang || lang === "js" || lang === "ts")) fmt = js;

          t = [];
          end_tag = `</${tag}>`;
        }
      }
    }
  }
  if (t?.length) res.push(...t);
  return [res.join("\n").trim(), errors];
};
