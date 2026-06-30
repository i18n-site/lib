#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh

cd test
rm -rf html
../lib/pug.js -c pug -o html

tail -n +1 html/*
