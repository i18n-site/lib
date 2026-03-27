export default (b64) =>
  Uint8Array.fromBase64(b64, {
    alphabet: "base64url",
  });
