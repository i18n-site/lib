import IpInvalid from "./IpInvalid.js";

export default (bin) => {
  // 根据数组长度判断是IPv4还是IPv6
  if (bin.length === 4) {
    // IPv4地址
    return bin.join(".");
  } else if (bin.length === 16) {
    // IPv6地址
    const parts = [];
    for (let i = 0; i < 16; i += 2) {
      // 将两个字节组合成一个16位值
      const value = (bin[i] << 8) | bin[i + 1];
      parts.push(value.toString(16));
    }

    // 压缩连续的0
    let longestZeroStart = -1;
    let longestZeroLength = 0;
    let currentZeroStart = -1;
    let currentZeroLength = 0;

    for (let i = 0; i < parts.length; i++) {
      if (parts[i] === "0") {
        if (currentZeroStart === -1) {
          currentZeroStart = i;
          currentZeroLength = 1;
        } else {
          currentZeroLength++;
        }
      } else {
        if (currentZeroStart !== -1 && currentZeroLength > longestZeroLength) {
          longestZeroStart = currentZeroStart;
          longestZeroLength = currentZeroLength;
        }
        currentZeroStart = -1;
        currentZeroLength = 0;
      }
    }

    // 检查末尾的零序列
    if (currentZeroStart !== -1 && currentZeroLength > longestZeroLength) {
      longestZeroStart = currentZeroStart;
      longestZeroLength = currentZeroLength;
    }

    // 应用压缩
    if (longestZeroLength > 1) {
      const compressedParts = [];
      for (let i = 0; i < parts.length; i++) {
        if (i === longestZeroStart) {
          if (i === 0) {
            compressedParts.push("");
          }
          compressedParts.push("");
          i += longestZeroLength - 1;
          if (i === parts.length - 1) {
            compressedParts.push("");
          }
        } else {
          compressedParts.push(parts[i]);
        }
      }
      return compressedParts.join(":");
    }

    return parts.join(":");
  }
  throw IpInvalid;
};
