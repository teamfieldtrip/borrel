#!/usr/bin/env bash

##
## Does a thing before allowing you to send your thing to the thing
##
## @author Roelof Roos <github@roelof.io>
##

# Get the root path from git, insteado of all the tricks
ROOT="$(cd "$( dirname "${BASH_SOURCE[0]}" )" && git rev-parse --show-toplevel)"
NODE_BIN="${ROOT}/node_modules/.bin"

# Define functions
function complete {
    # Restore stash
    git stash pop -q

    # Return status
    exit "$1"
}

# Tries to call the given function, exiting if it fails
function try_command {
    if ! "$@"; then
        complete $?
    fi
}

# Lets get verbose
set -xe

# Got to the git root
cd "${ROOT}"

# Stash all changes not indexed
git stash -q --keep-index

# Try to run eslint
try_command "${NODE_BIN}/eslint" .

# Complete with a success
complete 0
