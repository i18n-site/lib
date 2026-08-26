#!/usr/bin/env bash

DIR=$(realpath ${0%/*})
cd $DIR
set -ex

exec bun test
