#!/usr/bin/env coffee

> @aws-sdk/client-s3 > S3Client DeleteObjectCommand

< (conf, bucket)=>
  s3Client = new S3Client conf

  (key) =>
    s3Client.send new DeleteObjectCommand(
      Bucket: bucket
      Key: key
    )

