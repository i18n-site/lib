#!/usr/bin/env bun

import { S3Client } from "@bradenmacdonald/s3-lite-client";

export default (conf) => {
  // endPoint
  // region
  // accessKey
  // secretKey
  // bucket
  conf.pathStyle = false;
  return new S3Client(conf);
};
