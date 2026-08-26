#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

./gen.coffee
cd rust
cargo fmt
cargo v patch -y
git add -u && git commit -m. || true
cargo publish --registry crates-io
