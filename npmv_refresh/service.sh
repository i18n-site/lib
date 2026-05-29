#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

bun i

./build.sh

NAME=$(basename $DIR)

cp $NAME.sh /opt/bin/

add_service.sh $NAME
