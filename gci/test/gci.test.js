import { test, expect } from "bun:test";
import promptMake from "../src/prompt.js";
import authRead from "../src/cline/auth.js";
import { simpleGit } from "simple-git";

test("authRead returns valid token", async () => {
  const token = await authRead();
  expect(token).toBeString();
  expect(token.startsWith("workos:")).toBeTrue();
});

test("authRead force refresh works", async () => {
  const token = await authRead(true);
  expect(token).toBeString();
  expect(token.startsWith("workos:")).toBeTrue();
});


test("promptMake truncates large diff and generates valid prompt", async () => {
  const git = simpleGit(process.cwd());
  const large_diff = "diff --git a/test.txt b/test.txt\n" + "+line\n".repeat(4000);
  const prompt = await promptMake(git, large_diff);

  expect(prompt).toBeString();
  expect(prompt.includes("作为资深开发者")).toBeTrue();
  expect(prompt.includes("diff 已截断")).toBeTrue();
  expect(prompt.length < 30000).toBeTrue();
});
