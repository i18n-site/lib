#!/usr/bin/env bash

DIR=$(dirname $(realpath "$0"))
cd $DIR
set -ex

./build.sh
rsync -av --delete lib/ cf/src/
