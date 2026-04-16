import pug from "./pug.js";
import styl from "./styl.js";

const langByList = (li) => {
  for (const i of li) {
    const [k, v] = i.split("=");
    if (k === "lang") return v.replaceAll('"', "");
  }
};

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
      } else {
        t.push(line);
      }
    } else {
      res.push(line);
      if (line.startsWith("<") && line.endsWith(">")) {
        const li = line.slice(1, -1).split(" ");
        tag = li.shift().trim();
        if (tag === "template" && langByList(li) === "pug") fmt = pug;
        else if (tag === "style" && langByList(li) === "stylus") fmt = styl;
        t = [];
        end_tag = `</${tag}>`;
      }
    }
  }
  if (t?.length) res.push(...t);
  return res.join("\n").trim();
};
