import ssl from "./lib.js";

export default (kid, hmacKey) =>
  ssl("https://acme.litessl.com/acme/v2/directory", {
    kid,
    hmacKey,
  });
