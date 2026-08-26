#!/usr/bin/env bash

DIR=$(cd "$(dirname "$0")"; pwd)
cd $DIR
set -ex

cargo build --target wasm32-unknown-unknown --release
rust_wasm=./target/wasm32-unknown-unknown/release/_.wasm
wasm-bindgen $rust_wasm --out-dir pkg --target nodejs --weak-refs
wasm-opt -O3 -o ./pkg/__bg.wasm ./pkg/__bg.wasm
./test.coffee

