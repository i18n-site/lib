import { isQuoted, isWrappedWith } from "./common.js";

export const isSvelteInterpolation = (val) =>
  (val.length >= 2 && isWrappedWith(val, "{", "}")) ||
  (val.length >= 3 && isQuoted(val) && isWrappedWith(val, "{", "}", 1));

export default isSvelteInterpolation;

