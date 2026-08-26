#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
. $DIR/cd_cargo.sh
if ! hash cargo-clippy 2>/dev/null; then
  rustup component add clippy
fi

cargo fmt

# dasel ".workspace.members.all()" -r toml -f Cargo.toml | xargs cargo fmt -p
set -x

exec cargo +nightly clippy \
  --tests --all-targets --allow-dirty \
  --all-features --fix -Z unstable-options -- \
  -A clippy::uninit_assumed_init \
  -W clippy::absolute_paths
