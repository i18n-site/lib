#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
set -e
# set -a
# cd ~/.config/token
# . atomgit.js0.env
# set +a
cd $DIR
set -x

./build.sh

if [ ! -n "$1" ]; then
  exec mise exec -- ./test/main.js | tee out.txt
else
  exec ./${@:1}
fi
