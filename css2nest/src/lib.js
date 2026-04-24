import { parse, generate } from "css-tree";

const AMP = "&",
  INDENT = "  ",
  AT_RULE = "atrule",
  COMB = " >+~",
  comb_ok = (c) => COMB.includes(c),
  node_ok = (n) => typeof n === "object" && n !== null && n.type !== AT_RULE && !Array.isArray(n),
  pre_ok = (pre, p) => p.length >= pre.length && pre.every((v, i) => v === p[i]),
  prefix = (paths) => {
    if (!paths.length) return [];
    const f = paths[0];
    let i = 0;
    while (i < f.length && paths.every((p) => p[i] === f[i])) i++;
    while (i > 0 && comb_ok(f[i - 1])) i--;
    return f.slice(0, i);
  },
  cut = (path) => {
    const i = path.findIndex((p, idx) => idx > 0 && (comb_ok(p) || p.startsWith(":")));
    return i < 0 ? path : path.slice(0, i);
  },
  strip = (paths, n) => paths.map((p) => p.slice(n)),
  insert = (node, paths, decls) => {
    if (paths.every((p) => !p.length)) return decls.length && node.child.push(decls);

    const last = node.child.at(-1);

    if (node_ok(last) && last.paths.length === 1 && paths.every((p) => pre_ok(last.paths[0], p))) {
      return insert(last, strip(paths, last.paths[0].length), decls);
    }

    let pc = prefix(paths);
    if (paths.length === 1 && pc.length === paths[0].length) pc = cut(paths[0]);

    if (pc.length && (paths.length > 1 || pc.length < paths[0].length)) {
      const group = { paths: [pc], child: [] };
      node.child.push(group);
      insert(group, strip(paths, pc.length), decls);
    } else if (node_ok(last) && last.child.join() === String(decls)) {
      last.paths.push(...paths);
    } else {
      node.child.push({ paths, child: decls.length ? [decls] : [] });
    }
  },
  pathify = (p, nested) => {
    if (!p.length) return nested ? AMP : "";
    const has_space = p[0] === " ";
    let path = has_space ? p.slice(1) : p;
    if (!nested) return path.join("");
    return (has_space ? "" : AMP) + path.join("");
  },
  flat = (nodes) => {
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (Array.isArray(n)) continue;
      n.child = flat(n.child);
      if (n.type !== AT_RULE && n.child.length === 1 && node_ok(n.child[0]) && !n.child.some(Array.isArray)) {
        const c = n.child[0];
        c.paths = n.paths.flatMap((p1) => c.paths.map((p2) => [...p1, ...p2]));
        nodes[i] = c;
      }
    }
    return nodes;
  },
  walk = (children) => {
    const root = { child: [] };
    for (const node of children) {
      const { type, prelude, block, name } = node;
      if (type === "Rule") {
        insert(
          root,
          prelude.children.toArray().map((sel) => sel.children.toArray().map(generate)),
          block.children.toArray().map((d) => (d.type === "Declaration" ? d.property + ": " + generate(d.value) : generate(d)))
        );
      } else if (type === "Atrule") {
        root.child.push({
          type: AT_RULE,
          name,
          prelude: prelude ? generate(prelude) : "",
          child: walk(block.children.toArray()),
        });
      }
    }
    return root.child;
  },
  render = (nodes, indent = "", nested = false) =>
    nodes
      .map((node) => {
        if (Array.isArray(node)) return node.map((d) => indent + d + ";").join("\n");
        const { type, child, paths, name, prelude } = node,
          is_rule = type !== AT_RULE,
          inner = render(child, indent + INDENT, is_rule);
        if (!inner) return "";
        const head = is_rule ? paths.map((p) => pathify(p, nested)).join(", ") : "@" + name + " " + prelude.replace(/:(?!\s)/g, ": ").trim();
        return indent + head + " {\n" + inner + "\n" + indent + "}";
      })
      .filter(Boolean)
      .join(indent ? "\n" : "\n\n");

export default (css) => render(flat(walk(parse(css).children.toArray())));
