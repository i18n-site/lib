#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

dump() {
  echo "export default $(cat $1/init.sql | sed ':a;N;$!ba;s/\n/ /g' | sed 's/ \+/ /g' | sed 's/\s*\([,=:()|;+.]\)\s*/\1/g' | tr -d '\n' | jq -Rs '.')" >src/$2.js

}

dump ../../rust/i18n-site/src INIT_SQL

./format.initSQL.sh

dump . INIT_PUB
