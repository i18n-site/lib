#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
set -e
cd $DIR
set -x

./build.sh

if [ ! -n "$1" ]; then
  exec mise exec -- ./test/main.coffee | tee out.txt
else
  exec ./${@:1}
fi
