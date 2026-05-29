#!/usr/bin/env bash

REAL_DIR=$(cd "$(dirname "$(realpath "$0")")" && pwd)

DIR=$(cd "$(dirname "$0")" && pwd)
if [[ "$DIR" == */sh ]]; then
  DIR=$(cd "$DIR/.." && pwd)
fi
cd "$DIR"
set -ex

"$REAL_DIR/build.sh"
./test.js
