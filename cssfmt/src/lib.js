import { parse, generate } from "css-tree";
import css2nest from "@3-/css2nest";

const STYLE_SHEET = "StyleSheet",
  BLOCK = "Block",
  RAW = "Raw",
  COMMENT = "Comment",
  IMPORT = "import",
  AT_RULE = "Atrule",
  RGBA = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g,
  hex = (v) => Math.round(v).toString(16).padStart(2, "0"),
  toHex = (_, r, g, b, a) => "#" + hex(r) + hex(g) + hex(b) + hex(parseFloat(a) * 255);

export default (css) => {
  const comments = [],
    parents = [],
    raws = [],
    walk = (node) => {
      if (!node || typeof node !== "object") return;
      const { type } = node;
      if (type === STYLE_SHEET || type === BLOCK) {
        node.comments = [];
        parents.push(node);
      } else if (type === RAW) {
        raws.push(node);
      }
      for (const key in node) {
        const val = node[key];
        if (val && typeof val === "object") {
          if (typeof val.toArray === "function") val.toArray().forEach(walk);
          else walk(val);
        }
      }
    },
    ast = parse(css, {
      positions: true,
      onComment: (value, loc) => {
        comments.push({ type: COMMENT, value, loc });
      },
    });

  walk(ast);

  parents.sort(
    ({ loc: a }, { loc: b }) => a.end.offset - a.start.offset - (b.end.offset - b.start.offset),
  );

  for (const c of comments) {
    const {
      loc: {
        start: { offset: s },
        end: { offset: e },
      },
    } = c;
    if (raws.some(({ loc }) => loc && loc.start.offset <= s && e <= loc.end.offset)) continue;

    const p = parents.find(({ loc }) => loc.start.offset <= s && e <= loc.end.offset);
    if (p) p.comments.push(c);
  }

  for (const p of parents) {
    const { comments: cms, children } = p;
    if (cms.length) {
      children.fromArray(
        [...children.toArray(), ...cms].sort(
          ({ loc: a }, { loc: b }) => a.start.offset - b.start.offset,
        ),
      );
    }
  }

  const imports = [],
    others = [];
  let tmp = [];
  for (const c of ast.children.toArray()) {
    if (c.type === COMMENT) {
      tmp.push(c);
    } else if (c.type === AT_RULE && c.name === IMPORT) {
      imports.push(...tmp, c);
      tmp = [];
    } else {
      others.push(...tmp, c);
      tmp = [];
    }
  }
  others.push(...tmp);
  ast.children.fromArray([...imports, ...others]);

  return css2nest(generate(ast)).replace(RGBA, toHex);
};
