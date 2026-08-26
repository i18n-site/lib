#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

if [ ! -n "$1" ]; then
  exec direnv exec . ./lib/mysql2rust.js -r gen.rs
else
  exec ./${@:1}
fi
