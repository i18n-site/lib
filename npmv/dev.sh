#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

exec mise exec -- bun x concurrently --names "js,cf" '../dev.sh npmv' './cf/dev.sh'
