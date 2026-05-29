#! /usr/bin/env bun
import { describe, it, expect } from 'vitest';
import { $ } from 'zx';

describe('wait-for-port bin', () => {
  it('should exit quickly for an open port', async () => {
    const result = await $`bun src/bin.js google.com:80`.quiet();
    expect(result.exitCode).toBe(0);
  });

  it('should run command on failure', async () => {
    const tmp_file = `/tmp/wait-for-port-test-${Math.random().toString(36).substring(7)}`;
    try {
      await $`timeout 2s bun src/bin.js 127.0.0.1:65534 "touch ${tmp_file}"`.nothrow();
      const exists = await $`ls ${tmp_file}`.quiet().then(() => true).catch(() => false);
      expect(exists).toBe(true);
    } finally {
      await $`rm -f ${tmp_file}`.quiet().nothrow();
    }
  });
});
