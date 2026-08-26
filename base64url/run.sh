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
bun test
