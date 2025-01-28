#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

# if [ ! -n "$1" ]; then
#   exec direnv exec . ./test/main.js | tee out.txt
# else
#   exec ./${@:1}
# fi
