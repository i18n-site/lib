import IpInvalid from "./IpInvalid.js";

export default (ip) => {
  if (ip.includes(":")) {
    // IPv6地址，转换为16字节数组
    // 首先处理压缩表示法
    let fullAddress = ip;
    if (ip.includes("::")) {
      // 处理 :: 压缩表示
      const parts = ip.split("::");
      const left = parts[0] ? parts[0].split(":") : [];
      const right = parts[1] ? parts[1].split(":") : [];
      const missing = 8 - left.length - right.length;

      const fullParts = [...left];
      for (let i = 0; i < missing; i++) {
        fullParts.push("0");
      }
      fullParts.push(...right);
      fullAddress = fullParts.join(":");
    }

    const parts = fullAddress.split(":");
    if (parts.length !== 8) {
      throw IpInvalid;
    }

    const bytes = [];
    for (const part of parts) {
      if (part === "") {
        bytes.push(0, 0);
        continue;
      }

      // 将十六进制字符串转换为2字节
      const value = parseInt(part, 16);
      if (isNaN(value) || value < 0 || value > 0xffff) {
        throw IpInvalid;
      }

      // 高字节在前（网络字节序）
      bytes.push((value >> 8) & 0xff, value & 0xff);
    }

    return new Uint8Array(bytes);
  }
  if (ip.includes(".")) {
    // IPv4地址，转换为4字节数组
    const parts = ip.split(".");
    if (parts.length !== 4) {
      throw IpInvalid;
    }

    const bytes = parts.map((part) => {
      const num = parseInt(part, 10);
      if (isNaN(num) || num < 0 || num > 255) {
        throw IpInvalid;
      }
      return num;
    });

    return new Uint8Array(bytes);
  }
  throw IpInvalid;
};
