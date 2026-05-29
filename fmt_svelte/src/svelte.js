import { formatterByTag } from "./registry.js";

export default async (code, file_name = "file.svelte") => {
  let end_tag,
    fmt,
    tag,
    t,
    line_offset = 1;
  const res = [],
    errors = [],
    lines = code.split("\n");

  for (let i = 0; i < lines.length; ++i) {
    const raw_line = lines[i],
      line = raw_line.trimEnd(),
      trim_line = line.trim();

    if (t) {
      if (trim_line === end_tag) {
        let content = t.join("\n");
        if (fmt) {
          const [out, errs] = await fmt(content, file_name);
          content = out;
          if (errs?.length) {
            for (let j = 0; j < errs.length; ++j) {
              const e = errs[j];
              errors.push({ ...e, line: (e.line || 0) + line_offset });
            }
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
          const attr_str = match[2] || "",
            lang_match = attr_str.match(/lang\s*=\s*(['"]?)([^'"\s>]+)\1/i),
            lang = lang_match ? lang_match[2].toLowerCase() : undefined;

          tag = current_tag;
          line_offset = i + 2;
          fmt = formatterByTag(tag, lang);

          t = [];
          end_tag = "</" + tag + ">";
        }
      }
    }
  }
  if (t?.length) res.push(...t);
  return [res.join("\n").trim(), errors];
};
