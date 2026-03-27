#!/usr/bin/env bun

import sleep from "@3-/sleep";
import { join } from "path";
import { test, expect } from "vitest";
import install from "../srv/install.js";
import uninstall from "../srv/uninstall.js";

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
  const scriptPath = join(import.meta.dirname, "dummy.js");
  await install({ name: service_name, scriptPath });
  const res = await waitForServer();
  expect(res).toBe("OK");
  console.log("安装测试通过");
}, 30000);

test("卸载后网络释放", async () => {
  await uninstall({ name: service_name });

  const res = await waitForServerToStop(15);
  expect(res).toBe("FAIL");
  console.log("卸载测试通过");
}, 30000);
