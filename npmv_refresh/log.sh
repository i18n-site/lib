#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

journalctl --no-hostname -xefu $(basename $DIR)
