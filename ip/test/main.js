#!/usr/bin/env bun

import ipBin from "../src/ipBin.js";
import binIp from "../src/binIp.js";

const ok = (cond, msg) => console.log((cond ? "PASS " : "FAIL ") + msg),
  err = (fn, msg) => {
    try {
      fn();
      ok(false, msg);
    } catch (e) {
      ok(true, msg + " (caught " + e + ")");
    }
  };

console.log("--- 基础功能测试 ---");

const ipv4_addr = "192.168.1.1",
  ipv4_bytes = ipBin(ipv4_addr);
ok(binIp(ipv4_bytes) === ipv4_addr, "IPv4 基础转换: " + ipv4_addr);

const ipv6_addr = "2001:db8:85a3::8a2e:370:7334",
  ipv6_bytes = ipBin(ipv6_addr);
ok(binIp(ipv6_bytes) === ipv6_addr, "IPv6 基础转换: " + ipv6_addr);

console.log("\n--- IPv6 压缩边缘测试 ---");

const ipv6_edge = {
  "::1": "::1",
  "::": "::",
  "1::": "1::",
  "1:0:2:0:0:3:0:0": "1:0:2::3:0:0", // 应该压缩最长的连零，长度相同时取前者
  "0:0:0:0:0:0:0:0": "::",
  "1:2:3:4:5:6:7:8": "1:2:3:4:5:6:7:8",
};

for (const [input, expected] of Object.entries(ipv6_edge)) {
  const bytes = ipBin(input),
    res = binIp(bytes);
  ok(res === expected, "IPv6 压缩 [" + input + "] -> [" + res + "] (期待: " + expected + ")");
}

console.log("\n--- 异常输入测试 (应抛出异常) ---");

err(() => ipBin("256.1.1.1"), "IPv4 溢出");
err(() => ipBin("1.1.1"), "IPv4 段数不足");
err(() => ipBin("1.1.1.1.1"), "IPv4 段数过多");
err(() => ipBin("a.b.c.d"), "IPv4 非法字符");
err(() => ipBin("2001:db8:::1"), "IPv6 连续三个冒号");
err(() => ipBin("2001:db8:z::1"), "IPv6 非法字符");
err(() => ipBin("1:2:3:4:5:6:7:8:9"), "IPv6 段数过多");
err(() => ipBin("1:2:3:4:5:6:7"), "IPv6 段数不足");
err(() => binIp(new Uint8Array([1, 2, 3])), "非法二进制长度 (3)");
err(() => binIp(new Uint8Array(17)), "非法二进制长度 (17)");

console.log("\n--- 双向一致性测试 ---");

const rand_ip = "2001:0:0:1:0:0:0:1",
  b1 = ipBin(rand_ip),
  s1 = binIp(b1),
  b2 = ipBin(s1);
ok(b1.every((v, i) => v === b2[i]), "双向一致性: " + rand_ip + " -> " + s1);
