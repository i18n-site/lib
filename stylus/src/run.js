import { NODE_VAR, NODE_PROP, NODE_RULE } from "./const.js";

const AT_RULES = new Set([
    "import",
    "require",
    "media",
    "keyframes",
    "font-face",
    "charset",
    "supports",
    "layer",
    "container",
    "namespace",
    "page",
    "document",
    "viewport",
    "counter-style",
    "font-feature-values",
    "property",
    "-webkit-keyframes",
    "-moz-keyframes",
    "-o-keyframes",
  ]),
  hasKeys = (obj) => {
    for (const _ in obj) return true;
    return false;
  },
  replace = (val_str, vars, props) => {
    if (!hasKeys(vars) && !hasKeys(props) && !val_str.includes("@")) {
      return val_str;
    }
    const res = val_str.replace(/@?([a-zA-Z_-][a-zA-Z0-9_-]*)/g, (match, name) => {
      if (match[0] === "@") {
        return AT_RULES.has(name) ? match : name in props ? props[name] : "";
      }
      return name in vars ? vars[name] : match;
    });
    return res.includes(" or ") ? res.split(/\s+or\s+/).find((p) => p.trim()) || "" : res;
  };

export default (root_nodes) => {
  const visit = (nodes, parent_vars, parent_props = Object.create(null)) => {
    const current_vars = Object.create(parent_vars),
      current_props = Object.create(parent_props),
      result = [],
      rules = [],
      evaluated_nodes = [];

    for (const node of nodes) {
      const [type, name, val, line, file] = node;
      if (type === NODE_VAR) {
        current_vars[name] = replace(val, current_vars, current_props);
      } else if (type === NODE_PROP) {
        const evaluated = replace(val, current_vars, current_props);
        current_props[name] = evaluated;
        evaluated_nodes.push([NODE_PROP, name, evaluated, line, file]);
      } else if (type === NODE_RULE) {
        rules.push(node);
      }
    }

    for (const node of rules) {
      const [, sel, children, line, file] = node;
      result.push([
        NODE_RULE,
        replace(sel, current_vars, current_props),
        visit(children, current_vars, current_props),
        line,
        file,
      ]);
    }

    result.unshift(...evaluated_nodes);
    return result;
  };

  return visit(root_nodes, Object.create(null));
};
