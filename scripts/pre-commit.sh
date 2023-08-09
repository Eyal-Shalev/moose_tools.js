#!/usr/bin/env bash

set -e # exit with nonzero exit code if anything fails
set -o pipefail # exit if any command in a pipeline fails

deno fmt
deno lint
