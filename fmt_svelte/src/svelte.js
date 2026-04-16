import pug from "./pug.js";
import styl from "./styl.js";

const langByList = (li) =>
  li
    .find((s) => s.startsWith("lang="))
    ?.split("=")[1]
    ?.replace(/['"]/g, "");

export default async (code) => {
  let end_tag, fmt, tag, t;
  const res = [];
  for (const raw_line of code.split("\n")) {
    const line = raw_line.trimEnd(),
      trim_line = line.trim();
    if (t) {
      if (trim_line === end_tag) {
        let content = t.join("\n");
        if (fmt) {
          try {
            content = await fmt(content);
          } catch (e) {
            throw new Error(`${content}\n${tag}: ${e}`);
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
          const attr_str = match[2] || "";
          const lang_match = attr_str.match(/lang\s*=\s*(['"]?)([^'"\s>]+)\1/i);
          const lang = lang_match ? lang_match[2].toLowerCase() : undefined;

          tag = current_tag;
          if (tag === "template" && lang === "pug") fmt = pug;
          else if (tag === "style" && (lang === "stylus" || lang === "styl")) fmt = styl;

          t = [];
          end_tag = `</${tag}>`;
        }
      }
    }
  }
  if (t?.length) res.push(...t);
  return res.join("\n").trim();
};
