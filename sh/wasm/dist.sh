#!/usr/bin/env bash

REAL_DIR=$(cd "$(dirname "$(realpath "$0")")" && pwd)

DIR=$(cd "$(dirname "$0")" && pwd)
if [[ "$DIR" == */sh ]]; then
  DIR=$(cd "$DIR/.." && pwd)
fi
cd "$DIR"
set -e
set -x

rm -rf pkg
"$REAL_DIR/build.sh"
bun "$REAL_DIR/dist.js"
cd pkg
npm publish --access=public --registry=https://registry.npmjs.org "$@"
