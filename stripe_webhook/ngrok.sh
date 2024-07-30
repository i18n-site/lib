#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

exec ngrok http --domain=legal-pelican-inherently.ngrok-free.app 3000
