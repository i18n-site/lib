#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
set -e
set -a
cd ~/.config/token
. atomgit.js0.env
. github.i18n.env
set +a
cd $DIR
set -x

./build.sh

# rm -f test/sync.yml
if [ ! -n "$1" ]; then
  exec mise exec -- ./test/main.js | tee out.txt
else
  exec ./${@:1}
fi
