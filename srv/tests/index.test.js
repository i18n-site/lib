#!/usr/bin/env bun

import sleep from "@3-/sleep";
import { join } from "path";
import { test, expect } from "vitest";
import install from "../srv/install.js";
import uninstall from "../srv/uninstall.js";
import { $ } from "zx";

const service_name = "test_srv_3_agent";

const checkServer = async () => {
  try {
    const res = await fetch("http://127.0.0.1:18374");
    const text = await res.text();
    console.log("获取", text);
    return text.trim();
  } catch (err) {
    console.log("错误", err.message);
    return "FAIL";
  }
};

const waitForServer = async (retries = 15) => {
  for (let i = 0; i < retries; i++) {
    await sleep(1e3);
    const res = await checkServer();
    if (res === "OK") return "OK";
  }
  if (process.platform === "linux") {
    try {
      await $`systemctl --user status test_srv_3_agent`;
      await $`journalctl --user -xeu test_srv_3_agent`;
    } catch (e) {
      console.error(e);
    }
  } else if (process.platform === "win32") {
    try {
      await $`schtasks /Query /TN test_srv_3_agent /V /FO LIST`;
    } catch (e) {}
  }
  return "FAIL";
};

const waitForServerToStop = async (retries = 15) => {
  for (let i = 0; i < retries; i++) {
    await sleep(1e3);
    const res = await checkServer();
    if (res === "FAIL") return "FAIL";
  }
  return "OK";
};

test("安装前无响应", async () => {
  const res = await waitForServerToStop(1);
  expect(res).toBe("FAIL");
});

test("安装后可连接", async () => {
  const scriptPath = join(import.meta.dirname, "中 文 目 录 测试", "dummy.js");
  await install(service_name, scriptPath);
  const res = await waitForServer();
  expect(res).toBe("OK");
  console.log("安装测试通过");
}, 30000);

test("重新安装应覆盖服务并返回新结果", async () => {
  const scriptPath2 = join(import.meta.dirname, "中 文 目 录 测试", "dummy2.js");
  await install(service_name, scriptPath2);
  let res;
  for (let i = 0; i < 15; i++) {
    await sleep(1e3);
    res = await checkServer();
    if (res === "OK2") break;
  }
  expect(res).toBe("OK2");
  console.log("重新安装覆盖测试通过");
}, 30000);

test("卸载后网络释放", async () => {
  await uninstall(service_name);

  const res = await waitForServerToStop(15);
  expect(res).toBe("FAIL");
  console.log("卸载测试通过");
}, 30000);
