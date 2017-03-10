/**
 * Runs all build scripts.
 *
 * @author Roelof Roos
 */

(function () {
  let winston = require('winston')
  let installPrecommit = require('./install-precommit')
  let prepareEnv = require('./prepare-env')
  let prepareFlow = require('./prepare-gitflow')

  winston.debug('Installing pre-commit hook...')
  if (installPrecommit(winston)) {
    winston.error('Failed to install precommit hook!')
    process.exit(1)
    return
  }

  winston.debug('Installing dotenv...')
  if (prepareEnv(winston)) {
    winston.error('Failed to prepare environment file!')
    process.exit(1)
    return
  }

  winston.debug('Configuring Git Flow...')
  if (prepareFlow(winston)) {
    winston.error('Failed to prepare Git Flow!')
    process.exit(1)
    return
  }

  winston.info('Build scripts finished')
}())
