#!/usr/bin/env bash

DIR=$(cd "$(dirname "$0")"; pwd)
cd $DIR
set -ex

./build.sh
./test.coffee
