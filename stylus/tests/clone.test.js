#!/usr/bin/env -S bun test
import { test, expect, describe } from "bun:test";
import compile from "../src/compile.js";
import errCloneable from "../src/errCloneable.js";
import { resolve } from "node:path";

describe("error cloneability", () => {
  const nonExistentPath = resolve("tests/temp_test_files/non_existent.styl");

  test("compile errors are cloneable", () => {
    try {
      compile(nonExistentPath);
      expect().fail("Should throw error");
    } catch (e) {
      expect(Array.isArray(e)).toBe(true);
      const cloned = structuredClone(e);
      expect(cloned).toEqual(e);
    }
  });

  test("ResolveMessage (non-cloneable) error is successfully normalized to cloneable", () => {
    let rawError;
    try {
      // Trigger a module resolution error to get a ResolveMessage under Bun
      require("./non_existent_file_xyz.js");
    } catch (e) {
      rawError = e;
    }

    expect(rawError).toBeDefined();
    expect(rawError.constructor.name).toBe("ResolveMessage");

    // Assert that the raw error cannot be cloned
    expect(() => structuredClone(rawError)).toThrow();

    // Normalize using our utility
    const normalized = errCloneable(rawError);

    // Assert that the normalized error is cloneable
    const cloned = structuredClone(normalized);
    expect(cloned.message).toContain("Cannot find module");
  });

  test("array errors are successfully normalized to cloneable Error objects", () => {
    const arrayError = [2, "/path/to/missing.styl"];
    const normalized = errCloneable(arrayError);

    expect(normalized instanceof Error).toBe(true);
    expect(normalized.message).toBe("Stylus compilation error: 2 (/path/to/missing.styl)");
    expect(normalized.code).toBe(2);
    expect(normalized.data).toBe("/path/to/missing.styl");

    const cloned = structuredClone(normalized);
    expect(cloned.message).toBe(normalized.message);
  });
});
