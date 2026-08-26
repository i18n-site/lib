#!/usr/bin/env -S bun test
import { test, expect } from "bun:test";
import { join } from "node:path";
import { mkdirSync, writeFileSync, readFileSync, rmSync } from "node:fs";
import cargoUpgrade from "../src/lib.js";

const tmp = join(import.meta.dirname, "tmp");

const setup = () => {
  rmSync(tmp, { recursive: true, force: true });
  mkdirSync(join(tmp, "crates/a"), { recursive: true });
  mkdirSync(join(tmp, "crates/b"), { recursive: true });
  mkdirSync(join(tmp, "app"), { recursive: true });

  writeFileSync(
    join(tmp, "Cargo.toml"),
    '[workspace]\nmembers = ["crates/*", "app"]\n\n[workspace.package]\nversion = "0.2.0"\n',
  );

  writeFileSync(
    join(tmp, "crates/a/Cargo.toml"),
    '[package]\nname = "crate_a"\nversion.workspace = true\n',
  );

  writeFileSync(
    join(tmp, "crates/b/Cargo.toml"),
    '[package]\nname = "crate_b"\nversion = "0.3.0"\n',
  );

  writeFileSync(
    join(tmp, "app/Cargo.toml"),
    '[package]\nname = "app"\nversion = "0.1.0"\n\n[dependencies]\ncrate_a = { path = "../crates/a", version = "0.1.0" }\ncrate_b = { path = "../crates/b", version = "0.1.0" }\n',
  );
};

const cleanup = () => {
  rmSync(tmp, { recursive: true, force: true });
};

test("cargo_upgrade glob and workspace version", () => {
  setup();
  try {
    cargoUpgrade(tmp);
    const app_toml = readFileSync(join(tmp, "app/Cargo.toml"), "utf8");
    expect(app_toml).toContain('version = "0.2.0"');
    expect(app_toml).toContain('version = "0.3.0"');
  } finally {
    cleanup();
  }
});
