#!/usr/bin/env bun

import { $, cd } from 'zx'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import yaml from 'js-yaml'
import packlist from 'npm-packlist'
import Arborist from '@npmcli/arborist'

$.verbose = 1

const
  dir = import.meta.dirname,
  hash_file = join(dir, 'publish.yml'),
  packages = ['darwin', 'linux', 'win32', 'srv'],
  hashes = existsSync(hash_file) ? (yaml.load(readFileSync(hash_file, 'utf8')) || {}) : {},
  getHash = async (data) => Buffer.from(await crypto.subtle.digest("SHA-256", data)).toString('base64url'),
  changed = []

for (const pkg of packages) {
  const
    pkg_dir = join(dir, pkg),
    arborist = new Arborist({ path: pkg_dir })

  cd(pkg_dir)

  const
    tree = await arborist.loadActual(),
    files = await packlist(tree),
    buffers = []

  files.sort()

  for (const file of files) {
    const
      file_path = join(pkg_dir, file),
      is_pkg_json = file === 'package.json'

    buffers.push(new TextEncoder().encode(file))

    if (is_pkg_json) {
      const { version, ...rest } = JSON.parse(readFileSync(file_path, 'utf8'))
      buffers.push(new TextEncoder().encode(JSON.stringify(rest)))
    } else {
      buffers.push(new Uint8Array(readFileSync(file_path)))
    }
  }

  const
    total_len = buffers.reduce((acc, b) => acc + b.length, 0),
    merged = new Uint8Array(total_len)

  let offset = 0
  for (const b of buffers) {
    merged.set(b, offset)
    offset += b.length
  }

  const current_hash = await getHash(merged)

  if (hashes[pkg] !== current_hash) {
    const { name } = JSON.parse(readFileSync(join(pkg_dir, 'package.json'), 'utf8'))
    changed.push({
      dir: pkg,
      name,
      hash: current_hash
    })
  }
}

if (changed.length > 0) {
  cd(dir)

  const changeset_content = `---\n${changed.map(({ name }) => `"${name}": patch`).join('\n')}\n---\n\nauto update\n`

  writeFileSync(join(dir, '.changeset', 'auto-update.md'), changeset_content, 'utf8')

  await $`bunx changeset version`

  for (const { dir: pkg_dir } of changed) {
    cd(join(dir, pkg_dir))
    await $`bun publish`
  }
  cd(dir)

  for (const { dir: pkg_dir, hash } of changed) {
    hashes[pkg_dir] = hash
  }
  writeFileSync(hash_file, yaml.dump(hashes), 'utf8')

  const { version: v } = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
  await $`git add .`
  try {
    await $`git commit -m "chore: release ${v}"`
    await $`git push`
  } catch (e) {}
}
