#!/usr/bin/env bash

set -e
DIR=$(realpath $0) && DIR=${DIR%/*}
cd $DIR
set -x

if [ -d "qwen-code" ]; then
  cd qwen-code
  git checkout origin/main -- .
  git pull
else
  git clone ssh://git@ssh.github.com:443/QwenLM/qwen-code.git --depth=1
  cd qwen-code
fi

npm i

jqrpl() {
  jq "$1" package.json | sponge package.json
}

redist() {
  cd $DIR/qwen-code/packages/$1
  local pkg="@3-/$2"

  npm i
  npm run build
  rm -rf dist
  npx tsc
  cd dist
  if [ -f package.json ]; then
    cd src
  fi
  cp ../package.json .

  jqrpl '.files = ["*"]'
  jqrpl ".name = \"$pkg\""
  jqrpl 'del(.devDependencies)'

  local ver=$(curl -s https://registry.npmjs.org/$pkg |
    jq -r '.["dist-tags"].latest' |
    awk -F. '{ $NF=$NF+1; OFS="."; print $1,$2,$3 }')
  jqrpl ".version = \"$ver\""
  jqrpl '.exports = {".": "./index.js", "./*": "./*"}'
}
publish() {
  npm publish --access public
}

redist core qwen-code-core
jqrpl '.main = "./index.js"'
publish

redist cli qwen-code
jqrpl 'del(.dependencies["@qwen-code/qwen-code-core"])'
cat package.json
rpl "@qwen-code/qwen-code-core" "@3-/qwen-code-core"
bun i -p @3-/qwen-code-core
publish
