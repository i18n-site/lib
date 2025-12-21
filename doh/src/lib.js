import reqJson from "@3-/req/reqJson.js";

export default (dns) => {
  const prefix = "https://" + dns + "?name=";
  return async (domain, type) =>
    reqJson(prefix + domain + "&type=" + type, {
      headers: { Accept: "application/dns-json" },
    });
};
