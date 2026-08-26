import CONF from "./conf.js";

export default (supremacy_options) =>
  Object.assign(
    {},
    CONF,
    supremacy_options
      ? Object.fromEntries(
          Object.entries(supremacy_options).map(([k, v]) => [
            k.replace(/^stylusSupremacy\./, ""),
            v,
          ]),
        )
      : {},
  );



