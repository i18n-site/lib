import { test, expect } from "bun:test";
import pLimit from "../src/lib.js";

test("concurrency limit", async () => {
  const limit = pLimit(2);
  let active = 0;
  let max_active = 0;

  const task = async (ms) => {
    active += 1;
    if (active > max_active) {
      max_active = active;
    }
    await new Promise((resolve) => setTimeout(resolve, ms));
    active -= 1;
  };

  await Promise.all([limit(() => task(30)), limit(() => task(30)), limit(() => task(30))]);

  expect(max_active).toBe(2);
});
