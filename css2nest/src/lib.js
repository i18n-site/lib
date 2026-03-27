import { parse, generate } from "css-tree";

const AMP = "&",
  INDENT = "  ",
  ATRULE = "atrule", // use as internal type
  COMB = " >+~",
  isComb = (c) => COMB.includes(c),
  isNode = (n) => typeof n === "object" && n !== null && n.type !== ATRULE && !Array.isArray(n),
  isPrefix = (pre, p) => p.length >= pre.length && pre.every((v, i) => v === p[i]),
  pre = (paths) => {
    if (!paths.length) return [];
    const f = paths[0];
    let i = 0;
    while (i < f.length && paths.every((p) => p[i] === f[i])) i++;
    while (i > 0 && isComb(f[i - 1])) i--;
    return f.slice(0, i);
  },
  first = (path) => {
    const i = path.findIndex((p, idx) => idx > 0 && (isComb(p) || p.startsWith(":")));
    return i < 0 ? path : path.slice(0, i);
  },
  strip = (paths, n) => paths.map((p) => p.slice(n)),
  insert = (node, paths, decls) => {
    if (paths.every((p) => !p.length)) return decls.length && node.child.push(decls);

    const last = node.child.at(-1);

    if (isNode(last) && last.paths.length === 1 && paths.every((p) => isPrefix(last.paths[0], p))) {
      return insert(last, strip(paths, last.paths[0].length), decls);
    }

    let pc = pre(paths);
    if (paths.length === 1 && pc.length === paths[0].length) pc = first(paths[0]);

    if (pc.length && (paths.length > 1 || pc.length < paths[0].length)) {
      const group = { paths: [pc], child: [] };
      node.child.push(group);
      insert(group, strip(paths, pc.length), decls);
    } else if (isNode(last) && last.child.join() === String(decls)) {
      last.paths.push(...paths);
    } else {
      node.child.push({ paths, child: decls.length ? [decls] : [] });
    }
  },
  strPath = (p, nested) => {
    if (!p.length) return nested ? AMP : "";
    if (p[0] === " ") p = p.slice(1);
    return (nested && (isComb(p[0][0]) || p[0][0] === ":") ? AMP : "") + p.join("");
  },
  process = (children) => {
    const root = { child: [] };
    for (const node of children) {
      if (node.type === "Rule") {
        insert(
          root,
          node.prelude.children.toArray().map((sel) => sel.children.toArray().map(generate)),
          node.block.children.toArray().map((d) => (d.type === "Declaration" ? `${d.property}: ${generate(d.value)}` : generate(d)))
        );
      } else if (node.type === "Atrule") {
        root.child.push({
          type: ATRULE,
          name: node.name,
          prelude: node.prelude ? generate(node.prelude) : "",
          child: process(node.block.children.toArray()),
        });
      }
    }
    return root.child;
  },
  gen = (nodes, indent = "", nested = false) =>
    nodes
      .map((node) => {
        if (Array.isArray(node)) return node.map((d) => indent + d + ";").join("\n");
        const is_rule = node.type !== ATRULE;
        const inner = gen(node.child, indent + INDENT, is_rule);
        if (!inner) return "";
        const head = is_rule ? node.paths.map((p) => strPath(p, nested)).join(", ") : `@${node.name} ${node.prelude.replace(/:(?!\s)/g, ": ")}`.trim();
        return `${indent}${head} {\n${inner}\n${indent}}`;
      })
      .filter(Boolean)
      .join(indent ? "\n" : "\n\n");

export default (css) => gen(process(parse(css).children.toArray()));
