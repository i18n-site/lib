import yaml from 'js-yaml'
import { join } from 'path'
import { readFileSync, writeFileSync } from 'fs'
import packlist from 'npm-packlist'
import Arborist from '@npmcli/arborist'

const dir = process.cwd()
const hash_file = join(dir, 'publish.yml')
const packages = ['darwin', 'linux', 'win32', 'srv']

const getHash = async (data) => Buffer.from(await crypto.subtle.digest("SHA-256", data)).toString('base64url');

const hashes = {}
for (const pkg of packages) {
  const pkg_dir = join(dir, pkg)
  const arborist = new Arborist({ path: pkg_dir })
  const tree = await arborist.loadActual()
  const files = await packlist(tree)
  files.sort()
  const buffers = []
  for (const file of files) {
    const file_path = join(pkg_dir, file)
    buffers.push(new TextEncoder().encode(file))
    if (file === 'package.json') {
      const { version, ...rest } = JSON.parse(readFileSync(file_path, 'utf8'))
      buffers.push(new TextEncoder().encode(JSON.stringify(rest)))
    } else {
      buffers.push(new Uint8Array(readFileSync(file_path)))
    }
  }
  const total_len = buffers.reduce((acc, b) => acc + b.length, 0)
  const merged = new Uint8Array(total_len)
  let offset = 0
  for (const b of buffers) {
    merged.set(b, offset)
    offset += b.length
  }
  hashes[pkg] = await getHash(merged)
}
writeFileSync(hash_file, yaml.dump(hashes), 'utf8')
console.log("Updated publish.yml")
