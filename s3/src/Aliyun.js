#!/usr/bin/env bun

import s3 from "./s3.js";

export default (conf) => {
  conf.region = conf.endPoint.split(".", 1)[0].replace("oss-", "");
  return s3(conf);
};
