#!/usr/bin/env bash

##
## Adds Git Flow configs automatically
##
## @author Roelof Roos
##

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT_DIR=$(dirname ${DIR})

echo Setting Git Flow config

set -xe

git config --local gitflow.branch.master master
git config --local gitflow.branch.develop develop
git config --local gitflow.prefix.feature feature/
git config --local gitflow.prefix.release release/
git config --local gitflow.prefix.hotfix hotfix/
git config --local gitflow.prefix.support support/
git config --local gitflow.prefix.versiontag v
git config --local gitflow.path.hooks "${DIR}/.git/hooks"
