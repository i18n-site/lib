#!/usr/bin/env bash

DIR=$(
  cd "$(dirname "$0")"
  pwd
)
cd $DIR
set -ex

TARGET=$(cargo metadata | jq -r '.target_directory')/wasm32-unknown-unknown/release
rm -rf $TARGET

cargo build --target wasm32-unknown-unknown --release

rust_wasm=$TARGET/_.wasm

wasm-bindgen $rust_wasm --out-dir pkg --target nodejs --weak-refs

if ! [ -x "$(command -v wasm-opt)" ]; then
  cargo install wasm-opt
fi

wasm-opt -O3 -o ./pkg/__bg.wasm ./pkg/__bg.wasm
