#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

if [ ! -n "$1" ]; then
  ./test/main.coffee | tee out.txt
else
  ./${@:1}
fi
