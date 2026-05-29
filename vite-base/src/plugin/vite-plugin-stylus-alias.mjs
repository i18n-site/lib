import querystring_1 from "querystring";
import path_1 from "path";

function parseVueRequest(id) {
  const [filename, rawQuery] = id.split("?", 2);
  const query = querystring_1.parse(rawQuery);
  if (query.vue !== undefined) query.vue = true;
  return {
    filename,
    query,
  };
}

function transform(code, id, aliasConfig = new Map()) {
  const { query, filename } = parseVueRequest(id);
  const extname = path_1.extname(filename);
  if (
    (query.vue && query.type != "style") ||
    (!query.vue && extname !== ".styl" && extname !== "stylus")
  )
    return code;
  // 获取所有import字符串
  const importReg = /@import ['"][^'"]*['"]/g;
  const oldImports = code.match(importReg);
  if (!oldImports) return code;
  const newImports = oldImports.map((oldImport) => {
    oldImport = oldImport.replaceAll('"', "'");
    var pos = oldImport.indexOf("'") + 1;
    var end = oldImport.indexOf("/", pos);
    var dir = aliasConfig.get(oldImport.slice(pos, end));
    if (dir) {
      return oldImport.slice(0, pos) + dir + oldImport.slice(end);
    }
    return oldImport;
  });
  oldImports.forEach((oldImport, index) => {
    const newImport = newImports[index];
    if (oldImport === newImport) return;
    code = code.replace(oldImport, newImport);
  });
  return code;
}

function stylusAlias() {
  let aliasConfig = new Map();
  return {
    name: "vite-plugin-stylus-alias",
    enforce: "pre",
    configResolved(viteConfig) {
      for (const { find, replacement } of viteConfig.resolve.alias || []) {
        aliasConfig.set(find, replacement);
      }
    },
    transform(code, id) {
      return {
        code: transform(code, id, aliasConfig),
      };
    },
  };
}
export default stylusAlias;
