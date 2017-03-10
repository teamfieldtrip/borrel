/**
 * Sets settings for Git Flow
 *
 * @author Roelof Roos
 */

module.exports = function (winston) {
  let root = require('app-root-path')
  var requireOptional = require('require-optional')
  let git = requireOptional('git-utils')

  if (!git) {
    winston.info('Skipping git flow config')
    return 0
  }

  let env = process.env.NODE_ENV
  winston.debug(`Environment is ${env}.`)

  if (env && env !== 'development') {
    winston.info(`Not in development mode!`)
    return 0
  }

  let repo

  try {
    repo = git.open(root)
  } catch (variable) {
    winston.error('Cannot open log!')
    return 1
  }

  let settings = [
    ['gitflow.branch.master', 'master'],
    ['gitflow.branch.develop', 'develop'],
    ['gitflow.prefix.feature', 'feature/'],
    ['gitflow.prefix.release', 'release/'],
    ['gitflow.prefix.hotfix', 'hotfix/'],
    ['gitflow.prefix.support', 'support/'],
    ['gitflow.prefix.versiontag', 'v'],
    ['gitflow.path.hooks', `${root}/.git/hooks`]
  ]

  winston.log('Setting config values...')

  for (var i = 0; i < settings.length; i++) {
    let setting = settings[i]

    winston.debug(`Setting ${setting[0]} to ${setting[1]}...`)
    if (repo.setConfigValue(setting[0], setting[1])) {
      winston.debug('Set OK!')
    } else {
      winston.warn(`Failed to set ${setting[0]} to ${setting[1]}.`)
    }
  }

  return 0
}
