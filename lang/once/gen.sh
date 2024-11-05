#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
eval $(mise env)
set -ex

./rust.coffee
./case.coffee
./code_id.coffee
./nospcae.coffee
