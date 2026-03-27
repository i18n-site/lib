#!/usr/bin/env bash

DIR=$(realpath ${0%/*})
cd $DIR
set -ex

build
bunx babel --plugins @babel/plugin-transform-modules-commonjs lib/index.js >lib/index.cjs
esbuild --platform=node --format=cjs --bundle --charset=utf8 --allow-overwrite --outfile=lib/index.cjs lib/index.cjs
