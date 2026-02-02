#!/usr/bin/env bash

DIR=$(realpath ${0%/*})
cd $DIR
set -ex

build

for file in ./lib/*.js; do
  bunx babel --plugins @babel/plugin-transform-modules-commonjs $file >${file/.js/.cjs}
done
