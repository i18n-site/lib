import pug from "./pug.js";
import styl from "./styl.js";

const langByList = (li) =>
  li
    .find((s) => s.startsWith("lang="))
    ?.split("=")[1]
    .replace(/['"]/g, "");

export default async (code) => {
  let end_tag, fmt, tag, t;
  const res = [];
  for (const raw_line of code.split("\n")) {
    const line = raw_line.trimEnd();
    if (t) {
      if (line === end_tag) {
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
      if (line.startsWith("<") && line.endsWith(">")) {
        const li = line.slice(1, -1).split(" "),
          lang = langByList(li);
        tag = li.shift().trim();
        if (tag === "template" && lang === "pug") fmt = pug;
        else if (tag === "style" && lang === "stylus") fmt = styl;
        t = [];
        end_tag = `</${tag}>`;
      }
    }
  }
  if (t?.length) res.push(...t);
  return res.join("\n").trim();
};
