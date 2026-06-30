#!/usr/bin/env bash

if [ -z "$1" ]; then
  echo "USAGE : $0 project_name"
  exit 1
else
  cd $1
fi
. /etc/profile
set -ex
exec mise exec -- ./lib/main.js ${1%/*/*}/conf/npmv_refresh/conf.mjs
