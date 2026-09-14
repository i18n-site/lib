#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
set -e
cd $DIR
set -x

./build.sh

bun test --only-failures
