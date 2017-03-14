#!/usr/bin/env bash

##
## Does a thing before allowing you to send your thing to the thing
##
## @author Roelof Roos <github@roelof.io>
##

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT_DIR=$(dirname ${DIR})
cd $GIT_DIR

set -xe

node $GIT_DIR/src/build/build.js

echo Setting Git Flow config

git config --local gitflow.branch.master master
git config --local gitflow.branch.develop develop
git config --local gitflow.prefix.feature feature/
git config --local gitflow.prefix.release release/
git config --local gitflow.prefix.hotfix hotfix/
git config --local gitflow.prefix.support support/
git config --local gitflow.prefix.versiontag v
git config --local gitflow.path.hooks "${DIR}/.git/hooks"

echo "Checking for global plugins..."
if ! which sequelize > /dev/null; then
    echo ""
    echo "##############"
    echo "# Attention! #"
    echo "##############"
    echo "You don't have sequelize-cli installed."
    echo "Please install it:"
    echo "> npm install -g sequelize-cli"
    echo ""
fi
