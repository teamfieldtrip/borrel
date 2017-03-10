/**
 * Runs all build scripts.
 *
 * @author Roelof Roos <github@roelof.io>
 */

(function () {
  let winston = require('winston')
  let installPrecommit = require('./install-precommit')
  let prepareEnv = require('./prepare-env')

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

  winston.info('Build scripts finished')
}())
