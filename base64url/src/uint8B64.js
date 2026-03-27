export default (uint8) =>
  uint8.toBase64({
    alphabet: "base64url",
    omitPadding: true,
  });
