#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

nc -z -w 1 127.0.0.1 7890 && export https_proxy=http://127.0.0.1:7890

if [ ! -n "$1" ]; then
  NODE_USE_ENV_PROXY=1 mise exec -- ./test/gemini.coffee
else
  exec ./${@:1}
fi
