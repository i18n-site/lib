#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

./lib/pug.js -c ./test/pug -o ./test/html
