#!/usr/bin/env bash
export PATH="$HOME/.cargo/bin:$PATH"


if [[ ! -f "Cargo.toml" ]]; then
  DIR=$(cd "$(dirname "$0")" && pwd)
  if [[ "$DIR" == */sh ]]; then
    DIR=$(cd "$DIR/.." && pwd)
  fi
  if [[ -f "$DIR/Cargo.toml" ]]; then
    cd "$DIR"
  fi
fi

DIR=$(pwd)
set -ex

TARGET_DIR=$(cargo metadata --format-version 1 | jq -r '.target_directory')
export CARGO_TARGET_DIR="$TARGET_DIR/$(basename "$DIR")"

cargo build --target wasm32-unknown-unknown --release
rust_wasm="$CARGO_TARGET_DIR/wasm32-unknown-unknown/release/_.wasm"
wasm-bindgen $rust_wasm --out-dir pkg --target experimental-nodejs-module --weak-refs

if ! [ -x "$(command -v wasm-opt)" ]; then
  cargo install wasm-opt
fi

wasm-opt -O3 -o ./pkg/__bg.wasm ./pkg/__bg.wasm
