#!/usr/bin/env bun

import ipBin from "../src/ipBin.js";
import binIp from "../src/binIp.js";

console.log("测试IPv4转换功能：");

// 测试IPv4地址转换
const ipv4Address = "192.168.1.1";
const ipv4Bytes = ipBin(ipv4Address);
console.log(`IPv4地址 "${ipv4Address}" 转换为Uint8Array:`, ipv4Bytes);
console.log(`Uint8Array转换回IPv4地址: "${binIp(ipv4Bytes)}"`);
console.log(`转换是否正确: ${ipv4Address === binIp(ipv4Bytes)}`);

// 测试其他IPv4地址
const testIpv4Addresses = [
  "0.0.0.0",
  "255.255.255.255",
  "127.0.0.1",
  "10.0.0.1",
];

for (const addr of testIpv4Addresses) {
  const bytes = ipBin(addr);
  const convertedBack = binIp(bytes);
  console.log(
    `测试 ${addr}: ${addr === convertedBack ? "PASS" : "FAIL"} (${convertedBack})`,
  );
}

console.log("\n测试IPv6转换功能：");

// 测试IPv6地址转换
const ipv6Address = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";
const ipv6Bytes = ipBin(ipv6Address);
console.log(`IPv6地址 "${ipv6Address}" 转换为Uint8Array:`, ipv6Bytes);
console.log(`Uint8Array转换回IPv6地址: "${binIp(ipv6Bytes)}"`);

// 测试压缩形式的IPv6地址
const ipv6Compressed = "2001:db8:85a3::8a2e:370:7334";
const ipv6CompressedBytes = ipBin(ipv6Compressed);
console.log(
  `压缩IPv6地址 "${ipv6Compressed}" 转换为Uint8Array:`,
  ipv6CompressedBytes,
);
console.log(`Uint8Array转换回IPv6地址: "${binIp(ipv6CompressedBytes)}"`);

// 测试简化的IPv6地址
const testIpv6Addresses = ["2001:db8::1", "::1", "::", "fe80::1", "ff02::1"];

for (const addr of testIpv6Addresses) {
  try {
    const bytes = ipBin(addr);
    const convertedBack = binIp(bytes);
    console.log(`测试 ${addr}: PASS (${convertedBack})`);
  } catch (e) {
    console.log(`测试 ${addr}: FAIL - ${e.message}`);
  }
}

// 测试IPv6的双向转换
console.log("\n测试IPv6双向转换：");
const originalIpv6 = "2001:db8:85a3::8a2e:370:7334";
const bytesFromOriginal = ipBin(originalIpv6);
const convertedBackIpv6 = binIp(bytesFromOriginal);
const bytesFromConverted = ipBin(convertedBackIpv6);

console.log(`原始IPv6: ${originalIpv6}`);
console.log(`转换后IPv6: ${convertedBackIpv6}`);
console.log(
  `两次转换后的bytes是否相同: ${bytesFromOriginal.every((val, i) => val === bytesFromConverted[i])}`,
);
