#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
. ../../conf/env/cloudflare.sh
set -ex

bun x cf_work_secret -e cf/.dev.vars

./build.sh

cd cf
rm -rf src

bun x esbuild ../lib/main.js --bundle --minify --outfile=src/main.js --format=esm --external:node:* --external:mysql2

nr deploy
