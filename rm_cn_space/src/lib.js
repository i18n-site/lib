const RE = /(\p{Unified_Ideograph})\s+(\p{Unified_Ideograph})/gu;

export default (txt) => txt.replaceAll(RE, "$1$2");
