#!/usr/bin/env -S node --trace-uncaught --expose-gc --unhandled-rejections=strict --experimental-wasm-modules
import conn from "./conn.js";

import wrap from "./wrap.js";

export default (conf, parse, option = {}) => {
  return conn(conf, wrap(parse), option);
};
