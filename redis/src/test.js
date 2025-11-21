#!/usr/bin/env bun

import { createSentinel } from "redis";

export default (conf) => {
  return createSentinel(conf)
    .on("error", (err) => {
      console.error("❌ redis :", err);
    })
    .connect();
};
