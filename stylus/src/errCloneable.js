export default (err) => {
  if (err && typeof err === "object") {
    if (Array.isArray(err)) {
      const [code, val] = err,
        clean_err = Object.assign(
          new Error("Stylus compilation error: " + code + " (" + val + ")"),
          { code, data: val },
        );
      return clean_err;
    }
    try {
      structuredClone(err);
      return err;
    } catch {
      const { message, stack, code } = err,
        clean_err = Object.assign(new Error(message || String(err)), { stack });
      if (code) {
        clean_err.code = code;
      }
      return clean_err;
    }
  }
  return new Error(String(err));
};
