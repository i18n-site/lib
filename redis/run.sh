#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -o allexport
source ../../conf/docker/r.sh
set +o allexport
set -ex

./build.sh

if [ ! -n "$1" ]; then
  exec ./test/main.coffee | tee out.txt
else
  exec ./${@:1}
fi
