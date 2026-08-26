#!/usr/bin/env bash

DIR=$(realpath ${0%/*})
cd $DIR
set -ex

./gen.coffee
exec build
