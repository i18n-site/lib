#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
set -e
set -a
cd ~/.config/token
. cf.5kk.env
set +a
cd $DIR
set -x

./build.sh
./src/bin.js f003 talkcdn cdn.018007.xyz
