#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

if [ ! -n "$1" ]; then
  mise exec -- ./test/main.coffee | tee out.txt
  mise exec -- ./test/benchmark.js
else
  exec ./${@:1}
fi
