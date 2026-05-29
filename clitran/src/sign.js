import crypto from 'node:crypto'

/**
 * 不参与加签过程的 header key
 */
const HEADER_KEYS_TO_IGNORE = new Set([
  'authorization',
  'content-type',
  'content-length',
  'user-agent',
  'presigned-expires',
  'expect',
]);

export default (params) => {
  const {
    headers = {},
    query = {},
    region = '',
    serviceName = '',
    method = '',
    pathName = '/',
    accessKeyId = '',
    secretAccessKey = '',
    body,
  } = params;
  const searchParams = new URLSearchParams(query);
  searchParams.sort();

  const datetime = headers['X-Date'];
  const date = datetime.substring(0, 8);
  // 创建正规化请求
  const [signedHeaders, canonicalHeaders] = getSignHeaders(headers);

  const canonicalRequest = [
    method.toUpperCase(),
    pathName,
    searchParams.toString() || '',
    `${canonicalHeaders}\n`,
    signedHeaders,
    crypto.createHash('sha256').update(body).digest('hex'),
  ].join('\n');
  const credentialScope = [date, region, serviceName, 'request'].join('/');
  // 创建签名字符串
  const stringToSign = ['HMAC-SHA256', datetime, credentialScope, hash(canonicalRequest)].join(
    '\n',
  );
  // 计算签名
  const kDate = hmac(secretAccessKey, date);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, serviceName);
  const kSigning = hmac(kService, 'request');
  const signature = hmac(kSigning, stringToSign).toString('hex');

  return [
    'HMAC-SHA256',
    `Credential=${accessKeyId}/${credentialScope},`,
    `SignedHeaders=${signedHeaders},`,
    `Signature=${signature}`,
  ].join(' ');
}

function hmac(secret, s) {
  return crypto.createHmac('sha256', secret).update(s, 'utf8').digest();
}

function hash(s) {
  return crypto.createHash('sha256').update(s, 'utf8').digest('hex');
}

function getSignHeaders(originHeaders) {
  function trimHeaderValue(header) {
    return header.toString?.().trim().replace(/\s+/g, ' ') ?? '';
  }

  const needSignSet = new Set(['x-date', 'host'].map((k) => k.toLowerCase()));
  const h = Object.keys(originHeaders)
    .filter((k) => needSignSet.has(k.toLowerCase()))
    .filter((k) => !HEADER_KEYS_TO_IGNORE.has(k.toLowerCase()));

  const signedHeaderKeys = h
    .map((k) => k.toLowerCase())
    .sort()
    .join(';');
  const canonicalHeaders = h
    .sort((a, b) => (a.toLowerCase() < b.toLowerCase() ? -1 : 1))
    .map((k) => `${k.toLowerCase()}:${trimHeaderValue(originHeaders[k])}`)
    .join('\n');
  return [signedHeaderKeys, canonicalHeaders];
}

