export default (obj, str) => Object.entries(obj).reduce((acc, [k, v]) => acc.replaceAll(`$${k}`, v), str);
