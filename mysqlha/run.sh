#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

if [ ! -n "$1" ]; then
  exec direnv exec . ./lib/main.js -c ../../conf/mysqlha.yml | tee out.txt
else
  exec ./${@:1}
fi
