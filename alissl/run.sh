#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -a
. ~/.config/ali.env
set +a
set -ex

./build.sh
./test/main.js
