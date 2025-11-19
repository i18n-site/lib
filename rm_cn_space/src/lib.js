const RE = /([\p{Script=Han}])\s+([\p{Script=Han}])/gu;

export default (txt) => txt.replaceAll(RE, "$1$2");
