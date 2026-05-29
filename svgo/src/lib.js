#!/usr/bin/env bun

import { optimize } from "svgo";

export default (svg) =>
  optimize(svg, {
    plugins: [
      {
        name: "preset-default",
        params: {
          // overrides: {
          //   removeViewBox: false,
          // },
        },
      },
    ],
  }).data;
