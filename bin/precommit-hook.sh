#!/usr/bin/env bash

##
## Does a thing before allowing you to send your thing to the thing
##
## @author Roelof Roos <github@roelof.io>
##

# Figure out if we need to shush
if [ "$1" = "-q" ]; then
    QUIET=1
else
    QUIET=0
fi

COL_RED='\033[0;31m'
COL_GREEN='\033[1;32m'
COL_CMD='\033[0;35m'
COL_NC='\033[0m'

function output {
    if [ "$1" = "red" ]; then
        shift
        echo -e "${COL_RED}$*${COL_NC}"
    elif [ "$1" = "com" ]; then
        shift
        echo -e "${COL_CMD}$*${COL_NC}"
    elif [ "$QUIET" -eq 1 ]; then
        return
    elif [ "$1" = "green" ]; then
        shift
        echo -e "${COL_GREEN}$*${COL_NC}"
    else
        echo "$*"
    fi
}

# Got to the directory of this script
cd "$( cd "$( dirname "$( realpath "${BASH_SOURCE[0]}" )" )" )"

# And now get the root directory from git
ROOT="$(git rev-parse --show-toplevel)"

# And decide where the node modules directory is.
NODE_BIN="${ROOT}/node_modules/.bin"

if [ ! -d "${NODE_BIN}" ]
then
    output red "Node directory missing at ${NODE_BIN}"
    output red 'Please run `npm install`.'
    exit 1
fi

# Go to root directory
output com "+cd ${ROOT}"
cd "${ROOT}"

# Count changes
CHANGE_COUNT_GIT=$(git diff --cached --name-only | wc -l)
CHANGE_COUNT=$(git diff --name-only | wc -l)

if [ "$CHANGE_COUNT_GIT" -eq 0 ]; then
    output green "No pending changes"
    exit 0
fi

# Define functions
function complete {
    if [ "$1" -eq 0 ]
    then
        output green "Everything is OK!"
    else
        output red "Something is wrong!"
        output ""
        output 'Expected behaviour? Run `git commit --no-verify`'
    fi
    # Restore stash
    if [ $CHANGE_COUNT -gt 0 ]
    then
        output com "+git stash pop -q"
        git stash pop -q
    fi

    # Return status
    exit "$1"
}

# Tries to call the given function, exiting if it fails
function try_command {
    output com "+$*"
    if ! "$@"
    then
        complete $?
    fi
}

# Turn off immedate exit on error
set +e

# Stash all changes not indexed
if [ $CHANGE_COUNT -gt 0 ]
then
    output com "+git stash -q --keep-index"
    git stash save -q --keep-index
else
    output "No non-indexed changes to stash"
fi

# Try to run eslint
try_command "${NODE_BIN}/eslint" \
    "${ROOT}" \
    --max-warnings=0 \
    --cache=false

# Try to run npm test
try_command "$(which npm)" "test"

# Complete with a success
complete 0
