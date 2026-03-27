#!/usr/bin/env node
import { $, cd } from 'zx';
import { join } from 'path';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import yaml from 'js-yaml';
import packlist from 'npm-packlist';
import Arborist from '@npmcli/arborist';

const hash_file = join(import.meta.dirname, 'publish.yml'),
  packages = ['obj_replace', 'darwin', 'linux', 'win32', 'srv'],
  hashes = existsSync(hash_file) ? (yaml.load(readFileSync(hash_file, 'utf8')) || {}) : {},
  getHash = async (data) => Buffer.from(await crypto.subtle.digest("SHA-256", data)).toString('base64url'),
  processPkg = async (pkg) => {
    try {
      const pkg_dir = join(import.meta.dirname, pkg);
      cd(pkg_dir);

      const arborist = new Arborist({ path: pkg_dir }),
        tree = await arborist.loadActual(),
        files = await packlist(tree),
        buffers = [];

      files.sort();

      for (const file of files) {
        const file_path = join(pkg_dir, file),
          is_pkg_json = file === 'package.json';

        buffers.push(new TextEncoder().encode(file));

        if (is_pkg_json) {
          const { version, ...rest } = JSON.parse(readFileSync(file_path, 'utf8'));
          buffers.push(new TextEncoder().encode(JSON.stringify(rest)));
        } else {
          buffers.push(new Uint8Array(readFileSync(file_path)));
        }
      }

      const total_len = buffers.reduce((acc, b) => acc + b.length, 0),
        merged = new Uint8Array(total_len);

      let offset = 0;
      for (const b of buffers) {
        merged.set(b, offset);
        offset += b.length;
      }

      const current_hash = await getHash(merged);

      if (hashes[pkg] === current_hash) {
        return;
      }

      const pkg_json_file = join(pkg_dir, 'package.json'),
        pkg_data = JSON.parse(readFileSync(pkg_json_file, 'utf8')),
        version_parts = (pkg_data.version || '0.0.0').split('.');

      version_parts[2] = parseInt(version_parts[2], 10) + 1;
      pkg_data.version = version_parts.join('.');

      writeFileSync(pkg_json_file, JSON.stringify(pkg_data, null, 2) + '\n', 'utf8');

      await $`npm publish --access public`;

      hashes[pkg] = current_hash;
      writeFileSync(hash_file, yaml.dump(hashes), 'utf8');
    } catch (err) {
      console.error(err);
    }
  };

for (const pkg of packages) {
  await processPkg(pkg);
}
