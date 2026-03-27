#!/usr/bin/env bun

import { $, cd } from 'zx'
import { join } from 'path'
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs'
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
  changed = [],
  current = {}

try { unlinkSync(join(dir, 'srv/bun.lock')) } catch (e) {}

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

  const hash = await getHash(merged)
  current[pkg] = { hash, name: JSON.parse(readFileSync(join(pkg_dir, 'package.json'), 'utf8')).name }

  if (hashes[pkg] !== hash) {
    changed.push({ dir: pkg, name: current[pkg].name, hash })
  }
}

// 若有平台包变动，则 srv 必须重新发布绑定新版依赖
if (changed.some(c => c.dir !== 'srv') && !changed.some(c => c.dir === 'srv')) {
  changed.push({ dir: 'srv', name: current.srv.name, hash: current.srv.hash })
}

if (changed.length > 0) {
  cd(dir)

  const changeset_content = `---\n${changed.map(({ name }) => `"${name}": patch`).join('\n')}\n---\n\nauto update\n`

  writeFileSync(join(dir, '.changeset', 'auto-update.md'), changeset_content, 'utf8')

  await $`bunx changeset version`
  await $`bun install`

  for (const { dir: pkg_dir } of changed) {
    cd(join(dir, pkg_dir))
    try { unlinkSync('bun.lock') } catch (e) {}
    
    const pkg_json_path = join(dir, pkg_dir, 'package.json')
    const origin_pkg_json = readFileSync(pkg_json_path, 'utf8')
    const has_workspace = origin_pkg_json.includes('"workspace:*"')
    
    if (has_workspace) {
      const replaced = origin_pkg_json.replace(
        /"(@3-\/srv-(.*?))":\s*"workspace:\*"/g,
        (_, dep, p) => `"${dep}": "${JSON.parse(readFileSync(join(dir, p, 'package.json'), 'utf8')).version}"`
      )
      writeFileSync(pkg_json_path, replaced, 'utf8')
    }

    await $`bun publish`
    
    if (has_workspace) {
      writeFileSync(pkg_json_path, origin_pkg_json, 'utf8')
    }
  }
  cd(dir)

  for (const { dir: pkg_dir, hash } of changed) {
    hashes[pkg_dir] = hash
  }
  writeFileSync(hash_file, yaml.dump(hashes), 'utf8')

  const { version: v } = JSON.parse(readFileSync(join(dir, changed[0].dir, 'package.json'), 'utf8'))
  await $`git add .`
  try {
    await $`git commit -m "chore: release ${v}"`
    await $`git push`
  } catch (e) {}
}
