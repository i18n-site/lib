export const ext = (path) => {
    return path.endsWith(".styl") || path.endsWith(".css") ? path : path + ".styl";
  },
  isUrl = (path) => {
    return path.startsWith("url(") || /^(https?:)?\/\//.test(path);
  };
