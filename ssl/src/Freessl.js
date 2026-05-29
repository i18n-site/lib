import ssl from "./lib.js"

export default (accountKey, accountUrl) =>
  ssl("https://acme.litessl.com/acme/v2/directory", accountKey, accountUrl)
