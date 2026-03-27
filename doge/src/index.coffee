> @3-/utf8/utf8e.js

< (accessKey, secretKey)=>
  (api, data = {}) =>
    url = "https://api.dogecloud.com/" + api
    body = JSON.stringify(data)

    algorithm = { name: "HMAC", hash: "SHA-1" }
    sign = Array.from(
      new Uint8Array(
        await crypto.subtle.sign(
          algorithm.name,
          await crypto.subtle.importKey(
            "raw",
            utf8e(secretKey),
            algorithm,
            false,
            ["sign", "verify"],
          ),
          utf8e("/" + api + "\n" + body),
        ),
      ),
    ).map((b) =>b.toString(16).padStart(2, "0")).join("")
    r = await (
      await fetch(
        url
        {
          method: "POST"
          body
          headers: {
            Authorization: "TOKEN " + accessKey + ":" + sign
            "Content-Type": "application/json"
          }
        }
      )
    ).text()

    o = JSON.parse(r)
    if o.code == 200
      return o.data
    throw new Error(r)
    return
