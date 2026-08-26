import { isQuoted, isWrappedWith } from "./common.js";

export const isAngularBinding = (name) =>
  name.length >= 3 && name[0] === "[" && name.at(-1) === "]";

export const isAngularAction = (name) => name.length >= 3 && name[0] === "(" && name.at(-1) === ")";

export const isAngularDirective = (name) => name.length >= 2 && name[0] === "*";

export const isAngularInterpolation = (val) =>
  val.length >= 5 && isQuoted(val) && isWrappedWith(val, "{{", "}}", 1) && !val.includes("{{", 3);

export default {
  isAngularBinding,
  isAngularAction,
  isAngularDirective,
  isAngularInterpolation,
};
