/**
 * Adds a pre-commit hook, if it doesn't exist yet.
 *
 * @author Roelof Roos
 */

module.exports = function (winston) {
  let fs = require('fs')
  let root = require('app-root-path')
  let exists = require('file-exists').sync

  let precommitFile = `${root}/.git/hooks/pre-commit`
  let beforeLine = '#/start-eslint'
  let afterLine = '#/end-eslint'

  let commandLines = [
    beforeLine,
    `${root}/bin/precommit-hook.sh`,
    afterLine
  ]

  if (!exists(precommitFile)) {
    winston.debug(`Creating file with basic content at ${precommitFile}...`)
    try {
      let content = '#!/usr/bin/env bash\n'

      fs.writeFileSync(precommitFile, content, {
        mode: 0o775
      })
    } catch (err) {
      winston.error(`Failed to write ${precommitFile}: `, err)
      return 1
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
    return 0
  }

  winston.info(`Adding pre-commit hook to ${precommitFile}`)

  commandLines.forEach(function (line) {
    winston.debug(`Adding line "${line}"`)
    lines.push(line)
  })
  lines.push('')

  winston.debug(`Updating ${precommitFile}...`)

  fs.writeFileSync(precommitFile, lines.join('\n'))
}
