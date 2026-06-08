#!/usr/bin/env -S bun test
import { test, expect } from "bun:test";
import { dirname, join } from "node:path";
import { mkdirSync, writeFileSync, symlinkSync, rmSync } from "node:fs";
import walk, { walkRel } from "../lib/lib.js";
import walkWin from "../lib/walk.win.js";

const url_path = new URL(import.meta.url).pathname,
  dir = dirname(url_path),
  tmp = join(dir, "tmp");

const setup = () => {
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(tmp, { recursive: true });
  mkdirSync(join(tmp, "a"));
  mkdirSync(join(tmp, "b"));
  writeFileSync(join(tmp, "a/f1.txt"), "1");
  writeFileSync(join(tmp, "b/f2.txt"), "2");
  symlinkSync("../a", join(tmp, "b/link_a"));
  symlinkSync("f1.txt", join(tmp, "a/link_f1"));
};

const cleanup = () => {
  rmSync(tmp, { recursive: true, force: true });
};

test("walk", () => {
  setup();
  try {
    const files = Array.from(walk(tmp)),
      rel = files.map((f) => f.slice(tmp.length + 1)).sort();
    expect(rel).toEqual([
      "a/f1.txt",
      "a/link_f1",
      "b/f2.txt",
      "b/link_a/f1.txt",
      "b/link_a/link_f1",
    ]);
  } finally {
    cleanup();
  }
});

test("walkRel", () => {
  setup();
  try {
    const rel = Array.from(walkRel(tmp)).sort();
    expect(rel).toEqual([
      "a/f1.txt",
      "a/link_f1",
      "b/f2.txt",
      "b/link_a/f1.txt",
      "b/link_a/link_f1",
    ]);
  } finally {
    cleanup();
  }
});

test("ignore", () => {
  setup();
  try {
    const ignore = (p) => p.startsWith("b"),
      rel = Array.from(walkRel(tmp, ignore)).sort();
    expect(rel).toEqual(["a/f1.txt", "a/link_f1"]);
  } finally {
    cleanup();
  }
});

test("walkWin", () => {
  const mockWalk = function* () {
    yield "a\\b\\c.txt";
    yield "d/e/f.txt";
  };
  const win_walk = walkWin(mockWalk);
  expect(Array.from(win_walk())).toEqual(["a/b/c.txt", "d/e/f.txt"]);
});
