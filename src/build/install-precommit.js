/**
 * Adds a pre-commit hook, if it doesn't exist yet.
 *
 * @author Roelof Roos
 */

(function () {
  let winston = require('winston')
  let fs = require('fs')
  let root = require('app-root-path')
  let exists = require('file-exists').sync

  let precommitFile = `${root}/.git/hooks/pre-commit`
  let beforeLine = '#/start-eslint'
  let afterLine = '#/end-eslint'

  let commandLines = [
    beforeLine,
    '# Disable this by removing the lines below. Leave the above line intact,',
    '# as the file checker looks for this.',
    'git diff --name-only --cached --relative \\',
    '  | grep \'\\.jsx\\?$\' \\',
    `  | xargs ${root}/node_modules/.bin/eslint`,
    'if [ $? -ne 0 ];',
    'then',
    '  exit 1;',
    'fi',
    afterLine
  ]

  if (!exists(precommitFile)) {
    winston.debug(`Creating file with basic content at ${precommitFile}...`)
    try {
      let content = [
        '#!/usr/bin/env bash',
        'set -xe'
      ].join('\n')

      fs.writeFileSync(precommitFile, content, {
        mode: 0o775
      })
    } catch (err) {
      winston.error(`Failed to write ${precommitFile}: `, err)
      process.exit(1)
    }
  }

  let content = String(fs.readFileSync(precommitFile))
  let lines = content.split('\n')

  let contains = false

  winston.debug('Checking content of precommit hook...')

  for (var i = 0; i < lines.length; i++) {
    if (lines[i].trim() === beforeLine) {
      contains = true
      break
    }
  }

  if (contains) {
    winston.debug(`${precommitFile} contains a git hook like ours`)
    process.exit(0)
  }

  winston.info(`Adding pre-commit hook to ${precommitFile}`)

  commandLines.forEach(function (line) {
    winston.debug(`Adding line "${line}"`)
    lines.push(line)
  })
  lines.push('')

  winston.debug(`Updating ${precommitFile}...`)

  fs.writeFileSync(precommitFile, lines.join('\n'))
}())
