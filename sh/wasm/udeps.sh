#!/usr/bin/env bash

# 检测未使用的依赖

set -ex

if ! hash cargo-machete 2>/dev/null; then
  cargo install cargo-machete
fi

RUST_LOG=warn cargo machete --fix || true

[ -f "hook/udeps.sh" ] && hook/udeps.sh

# if ! hash cargo-udeps 2>/dev/null; then
#   cargo install cargo-udeps --locked
# fi
#
# cargo +nightly udeps --workspace --all-features --output json | direnv exec . ./udeps.coffee
