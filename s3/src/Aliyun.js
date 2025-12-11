#!/usr/bin/env bun

import { S3Client } from "@bradenmacdonald/s3-lite-client";

export default (access_key, secret_key, end_point, bucket) =>
  new S3Client({
    endPoint: end_point,
    region: end_point.split(".", 1)[0],
    accessKey: access_key,
    secretKey: secret_key,
    bucket,
    pathStyle: false,
  });
