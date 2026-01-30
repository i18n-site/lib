const percentEncode = (str) => {
  return encodeURIComponent(str)
    .replace(/!/g, "%21")
    .replace(/'/g, "%27")
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29")
    .replace(/\*/g, "%2A");
};

const signRequest = async (access_key, secret_key, params) => {
  const sorted_keys = Object.keys(params).sort();
  const canonical_query = sorted_keys
    .map((k) => `${percentEncode(k)}=${percentEncode(params[k])}`)
    .join("&");

  const string_to_sign = `POST&${percentEncode("/")}&${percentEncode(canonical_query)}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret_key + "&"),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(string_to_sign),
  );

  return btoa(String.fromCharCode(...new Uint8Array(signature)));
};

const callImmApi = async (access_key, secret_key, region, action, params) => {
  const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, "Z");
  const nonce = Math.random().toString(36).substring(2, 15);

  const common_params = {
    Format: "JSON",
    Version: "2020-09-30",
    AccessKeyId: access_key,
    SignatureMethod: "HMAC-SHA1",
    Timestamp: timestamp,
    SignatureVersion: "1.0",
    SignatureNonce: nonce,
    Action: action,
    ...params,
  };

  const signature = await signRequest(access_key, secret_key, common_params);
  common_params.Signature = signature;

  const query = Object.keys(common_params)
    .map(
      (k) => `${encodeURIComponent(k)}=${encodeURIComponent(common_params[k])}`,
    )
    .join("&");

  const url = `https://imm.${region}.aliyuncs.com/?${query}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return await response.json();
};

const createDocConvertTask = async (
  access_key,
  secret_key,
  region,
  project,
  src_uri,
  tgt_uri,
) => {
  const result = await callImmApi(
    access_key,
    secret_key,
    region,
    "CreateOfficeConversionTask",
    {
      ProjectName: project,
      SourceURI: src_uri,
      TargetType: "txt",
      TargetURIPrefix: tgt_uri,
    },
  );

  if (result.Code) {
    throw new Error(`${result.Code}: ${result.Message}`);
  }

  return result.TaskId;
};

const getDocConvertResult = async (
  access_key,
  secret_key,
  region,
  project,
  task_id,
) => {
  return await callImmApi(access_key, secret_key, region, "GetTask", {
    ProjectName: project,
    TaskId: task_id,
    TaskType: "OfficeConversion",
  });
};

const waitForTask = async (
  access_key,
  secret_key,
  region,
  project,
  task_id,
  interval = 1000,
) => {
  const result = await getDocConvertResult(
    access_key,
    secret_key,
    region,
    project,
    task_id,
  );

  if (result.Code) {
    throw new Error(`${result.Code}: ${result.Message}`);
  }

  if (result.Status === "Succeeded") {
    return result;
  }

  if (result.Status === "Failed") {
    throw new Error(`Task failed: ${result.Code}`);
  }

  await new Promise((resolve) => setTimeout(resolve, interval));
  return waitForTask(
    access_key,
    secret_key,
    region,
    project,
    task_id,
    interval,
  );
};

export default async (
  access_key,
  secret_key,
  region,
  project,
  bucket,
  filepath,
) => {
  const src_uri = `oss://${bucket}/${filepath}`;
  const tgt_uri = `oss://${bucket}/converted/${filepath}.txt`;

  const task_id = await createDocConvertTask(
    access_key,
    secret_key,
    region,
    project,
    src_uri,
    tgt_uri,
  );

  return await waitForTask(access_key, secret_key, region, project, task_id);
};
