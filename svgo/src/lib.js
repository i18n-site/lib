#!/usr/bin/env bun

import { optimize } from "svgo";

export const plugins = [
  {
    name: "preset-default",
    params: {
      overrides: {
        cleanupIds: false,
        removeHiddenElems: false,
        // overrides: {
        //   removeViewBox: false,
        // },
      },
    },
  },
  "removeViewBox",
];

export default (svg, conf = {}) =>
  optimize(svg, {
    multipass: true,
    plugins,
    ...conf,
  }).data;
