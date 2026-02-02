#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR

set -e

source cf/.dev.vars

psql $PG_URL <pg.sql
