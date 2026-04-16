export const isVueEventBinding = (name) => /^(v-on:|@).*/.test(name);

export const isVueExpression = (name) =>
  /^((v-(bind|slot))?:|v-(model|slot|if|for|else-if|text|html|t)|#).*/.test(name);

export const isVueVForWithOf = (name, val) => name === "v-for" && val.includes("of");

export const isVueVBindExpression = (name) => name === "v-bind";

export const isVueVOnExpression = (name) => name === "v-on";

export const isVueVDirective = (name) => name.startsWith("v-");

export default {
  isVueEventBinding,
  isVueExpression,
  isVueVForWithOf,
  isVueVBindExpression,
  isVueVOnExpression,
  isVueVDirective,
};

