import { parse, generate } from "css-tree";

const AMP = "&",
  INDENT = "  ",
  AT_RULE = "atrule",
  COMB = " >+~",
  COMMENT = "Comment",
  STYLE_SHEET = "StyleSheet",
  BLOCK = "Block",
  RAW = "Raw",
  combOk = (c) => COMB.includes(c),
  nodeOk = (n) =>
    typeof n === "object" &&
    n !== null &&
    n.type !== AT_RULE &&
    n.type !== COMMENT &&
    !Array.isArray(n),
  preOk = (pre, p) => p.length >= pre.length && pre.every((v, i) => v === p[i]),
  prefix = (paths) => {
    if (!paths.length) return [];
    const f = paths[0];
    let i = 0;
    while (i < f.length && paths.every((p) => p[i] === f[i])) ++i;
    while (i > 0 && combOk(f[i - 1])) --i;
    return f.slice(0, i);
  },
  cut = (path) => {
    const i = path.findIndex((p, idx) => idx > 0 && (combOk(p) || p.startsWith(":")));
    return i < 0 ? path : path.slice(0, i);
  },
  strip = (paths, n) => paths.map((p) => p.slice(n)),
  insert = (node, paths, decls) => {
    if (paths.every((p) => !p.length)) return decls.length && node.child.push(decls);

    const last = node.child.at(-1);

    if (nodeOk(last) && last.paths.length === 1 && paths.every((p) => preOk(last.paths[0], p))) {
      return insert(last, strip(paths, last.paths[0].length), decls);
    }

    let pc = prefix(paths);
    if (paths.length === 1 && pc.length === paths[0].length) pc = cut(paths[0]);

    if (pc.length && (paths.length > 1 || pc.length < paths[0].length)) {
      const group = { paths: [pc], child: [] };
      node.child.push(group);
      insert(group, strip(paths, pc.length), decls);
    } else if (nodeOk(last) && last.child.join() === String(decls)) {
      last.paths.push(...paths);
    } else {
      node.child.push({ paths, child: decls.length ? [decls] : [] });
    }
  },
  pathify = (p, nested) => {
    if (!p.length) return nested ? AMP : "";
    const has_space = p[0] === " ",
      path = has_space ? p.slice(1) : p;
    if (!nested) return path.join("");
    return (has_space ? "" : AMP) + path.join("");
  },
  flat = (nodes) => {
    for (let i = 0; i < nodes.length; ++i) {
      const n = nodes[i];
      if (Array.isArray(n)) continue;
      if (n.child) n.child = flat(n.child);
      if (
        n.type !== AT_RULE &&
        n.type !== COMMENT &&
        n.child &&
        n.child.length === 1 &&
        nodeOk(n.child[0]) &&
        !n.child.some(Array.isArray)
      ) {
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
      const { type, prelude, block, name, value } = node;
      if (type === "Rule") {
        insert(
          root,
          prelude.type === RAW
            ? [[prelude.value]]
            : prelude.children
                .toArray()
                .map((sel) =>
                  sel.type === RAW ? [sel.value] : sel.children.toArray().map(generate),
                ),
          block && block.children
            ? block.children
                .toArray()
                .map((d) =>
                  d.type === "Declaration" ? d.property + ": " + generate(d.value) : generate(d),
                )
            : [],
        );
      } else if (type === "Atrule") {
        root.child.push({
          type: AT_RULE,
          name,
          prelude: prelude ? generate(prelude) : "",
          block: !!block,
          child: block && block.children ? walk(block.children.toArray()) : [],
        });
      } else if (type === COMMENT) {
        root.child.push({
          type: COMMENT,
          value,
        });
      }
    }
    return root.child;
  },
  render = (nodes, indent = "", nested = false) =>
    nodes
      .map((node) => {
        if (Array.isArray(node))
          return node
            .map(
              (d) =>
                indent +
                d.replace(/\}(?=&)/g, "}\n") +
                (d.trim().endsWith("}") || d.trim().endsWith("*/") ? "" : ";"),
            )
            .join("\n");
        const { type, child, paths, name, prelude, block, value } = node;
        if (type === COMMENT) {
          return indent + "/*" + value + "*/";
        }
        const is_rule = type !== AT_RULE;
        if (type === AT_RULE && !block) {
          return (
            indent +
            "@" +
            name +
            (prelude ? " " + prelude.replace(/:(?!\s)/g, ": ").trim() : "") +
            ";"
          );
        }
        const inner = render(child, indent + INDENT, is_rule);
        if (!inner) return "";
        const head = is_rule
          ? paths.map((p) => pathify(p, nested)).join(", ")
          : "@" + name + " " + prelude.replace(/:(?!\s)/g, ": ").trim();
        return indent + head + " {\n" + inner + "\n" + indent + "}";
      })
      .filter(Boolean)
      .join(indent ? "\n" : "\n\n");

export default (css) => {
  const comments = [],
    parents = [],
    raws = [],
    walkAST = (node) => {
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
          if (typeof val.toArray === "function") val.toArray().forEach(walkAST);
          else walkAST(val);
        }
      }
    },
    ast = parse(css, {
      positions: true,
      onComment: (value, loc) => {
        comments.push({ type: COMMENT, value, loc });
      },
    });

  walkAST(ast);

  parents.sort(
    ({ loc: a }, { loc: b }) => a.end.offset - a.start.offset - (b.end.offset - b.start.offset),
  );

  for (const c of comments) {
    const {
      start: { offset: s },
      end: { offset: e },
    } = c.loc;
    if (raws.some(({ loc }) => loc && loc.start.offset <= s && e <= loc.end.offset)) continue;

    const p = parents.find(({ loc }) => loc.start.offset <= s && e <= loc.end.offset);
    if (p) p.comments.push(c);
  }

  for (const p of parents) {
    if (p.comments.length) {
      const combined = [...p.children.toArray(), ...p.comments];
      combined.sort(({ loc: a }, { loc: b }) => a.start.offset - b.start.offset);
      p.children.fromArray(combined);
    }
  }

  return render(flat(walk(ast.children.toArray())));
};
