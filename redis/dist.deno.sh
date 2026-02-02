#!/usr/bin/env bash

DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -ex

rm -rf lib
bun x cep -c src -o lib
cd lib
git init
cp ../deno.json .
jq --arg v "$(jq -r .version ../package.json)" '.version = $v' deno.json >tmp.json && mv tmp.json deno.json
cp ../README.md .
git add .
git commit -m"deno pg@$(cat deno.jsonc | jq '.version' -r)" || true
deno publish --token $(cat ~/.config/deno/publish.token) --unstable-sloppy-imports
