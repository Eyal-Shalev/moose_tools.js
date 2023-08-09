#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails
set -o pipefail # exit if any command in a pipeline fails
set -x # print commands

cd .git/hooks
ln -sf ../../scripts/pre-commit.sh pre-commit
ln -sf ../../scripts/pre-push.sh pre-push
