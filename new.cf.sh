#!/usr/bin/env bash

DIR=$(realpath ${0%/*})
cd $DIR

if [ -d "$1" ]; then
  echo "$1 EXIST"
  exit 1
fi

set -ex

cp -R tmpl.cf $1

cd $1

rpl tmpl $1
bun i

cd cf

rm -rf .dev.vars wrangler.toml
confdir=../../../conf/lib
ln -s $confdir/$1/cf/.dev.vars .
ln -s $confdir/$1/cf/wrangler.toml .
git add .

mkdir -p $confdir/$1/cf
cd $confdir
cp tmpl.cf/cf/wrangler.toml $1/cf/wrangler.toml
cd $1/cf
rpl tmpl $1
touch .dev.vars
git add .
