export default (msg) => (msg || "").replace(/^`+|`+$/g, "").trim();
