const RE = /([\p{Script=Han}\p{P}])\s+(?=[\p{Script=Han}\p{P}])/gu;

export default (txt) => txt.replaceAll(RE, "$1");
