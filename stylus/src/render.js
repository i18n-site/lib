import { NODE_PROP, NODE_RULE } from "./const.js";
import { GenMapping, addMapping, toEncodedMap } from "@jridgewell/gen-mapping";

export default (evaluated_nodes, gen_map = false) => {
  let gen_line = 1;
  const rendered = [],
    map = gen_map ? new GenMapping({ file: "output.css" }) : null,
    append = (text, orig_line = null, orig_file = null) => {
      if (gen_map && orig_line !== null && orig_file !== null) {
        addMapping(map, {
          generated: { line: gen_line, column: 0 },
          original: { line: orig_line, column: 0 },
          source: orig_file,
        });
      }
      rendered.push(text);
      const matches = text.match(/\n/g);
      if (matches) {
        gen_line += matches.length;
      }
    },
    render = (nodes, indent) => {
      const props = [],
        rules = [];
      for (const node of nodes) {
        const type = node[0];
        if (type === NODE_PROP) {
          props.push(node);
        } else if (type === NODE_RULE) {
          rules.push(node);
        }
      }

      props.forEach((prop) => {
        const [, name, value, line, file] = prop;
        append(indent + name + ": " + value + ";", line, file);
        append("\n");
      });

      rules.forEach((rule, idx) => {
        const [, sel, children, line, file] = rule;
        let selector = sel;

        if (selector.startsWith("@media") && !selector.includes(":")) {
          selector = selector.replace(/\(([a-z-]+)\s+([^)]+)\)/g, "($1: $2)");
        }

        if (children.length === 0) {
          append(indent + selector + ";", line, file);
          append("\n");
        } else {
          append(indent + selector + " {\n", line, file);
          render(children, indent + "  ");
          append(indent + "}\n");
        }

        if (idx < rules.length - 1) {
          append("\n");
        }
      });
    };

  render(evaluated_nodes, "");

  const css = rendered.join("");
  return gen_map ? [css, toEncodedMap(map)] : css;
};
