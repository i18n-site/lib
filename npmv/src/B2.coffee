> @3-/retry

import { S3 } from "@aws-sdk/client-s3"

export default retry (
  {
    B2_PK, B2_SK, B2_ENDPOINT, B2_BUCKET
  }
  path
  data
  mime
) =>
  s3client = new S3(
    endpoint: "https://"+B2_ENDPOINT
    region: "auto"
    credentials:
      accessKeyId: B2_PK
      secretAccessKey: B2_SK
  )

  return s3client.putObject(
    Bucket: B2_BUCKET
    Key: path
    Body: data
    ContentType: mime
  )

