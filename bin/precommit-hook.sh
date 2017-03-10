#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
GIT_DIR=$(dirname ${DIR})

# Checks for changed Javascript, and runs ESLint if required
CHANGED_FILES=$(git diff --name-only --cached --relative | grep '\.jsx\?$')
if [ $? -eq 0 ]; then
    echo Running ESLint...
    echo $CHANGED_FILES | xargs $GIT_DIR/node_modules/.bin/eslint
    if [ $? -ne 0 ]; then
        echo 'ESLint failed, aborting commit.'
        exit 1;
    else
        echo 'Good to go!'
    fi
fi
