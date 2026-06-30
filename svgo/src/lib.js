#!/usr/bin/env bun

import { optimize } from "svgo";

export const plugins = [
  {
    name: "preset-default",
    params: {
      // overrides: {
      //   removeViewBox: false,
      // },
    },
  },
];

export default (svg, conf = {}) =>
  optimize(svg, {
    plugins,
    ...conf,
  }).data;
