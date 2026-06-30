export default (supremacy_options) => {
  if (!supremacy_options) return {};
  return Object.fromEntries(
    Object.entries(supremacy_options.stylusSupremacy || supremacy_options).map(([k, v]) => [
      k.replace(/^stylusSupremacy\./, ""),
      v,
    ]),
  );
};
