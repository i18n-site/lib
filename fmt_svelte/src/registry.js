import js from "./js.js";
import styl from "./styl.js";
import pug from "./pug.js";
import svelte from "./svelte.js";

const M = {
    svelte,
    js,
    mjs: js,
    cjs: js,
    ts: js,
    styl,
    stylus: styl,
    pug,
  },
  TAG_M = {
    template: (lang) => (lang === "pug" ? pug : undefined),
    style: (lang) => (["styl", "stylus"].includes(lang) ? styl : undefined),
    script: (lang) => (!lang || ["js", "ts"].includes(lang) ? js : undefined),
  };

export const formatterByName = (name) => M[name.toLowerCase()],
  formatterByTag = (tag, lang) => {
    const f = TAG_M[tag.toLowerCase()];
    return f ? f(lang) : undefined;
  };
