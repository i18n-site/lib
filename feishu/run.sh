#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -a
. ~/.config/feishu.env
set +a
set -ex

./build.sh

if [ ! -n "$1" ]; then
  exec mise exec -- ./test/main.coffee | tee out.txt
else
  exec ./${@:1}
fi
