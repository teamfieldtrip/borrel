/**
 * Prepares an environment file
 *
 * @author Roelof Roos
 */

module.exports = function (winston) {
  let fs = require('fs')
  let root = require('app-root-path')
  let exists = require('file-exists').sync

  let envFile = `${root}/.env`
  let envSourceFile = `${root}/.env.example`

  let envFileExists = exists(envFile)
  let envSourceFileExists = exists(envSourceFile)

  if (envFileExists) {
    return 0
  }

  if (!envSourceFileExists) {
    winston.error(`Cannot find dotenv base file at ${envSourceFile}...`)
    return 1
  }

  winston.log(`Creating default dotenv file at ${envFile}`)
  fs.readFile(envSourceFile, 'utf8', function (err, data) {
    if (err) {
      winston.error(`Failed to read ${envSourceFile}: `, err)
      return (err.code || 1)
    }

    winston.debug(`Read data from ${envSourceFile}.`)
    winston.debug(`Writing data to ${envFile}...`)
    fs.writeFile(envFile, data, {mode: 0o644}, function (err, data) {
      if (!err) {
        winston.log(`Created .env file.`)
      } else {
        winston.error(`Failed to read ${envSourceFile}: `, err)
        return (err.code || 1)
      }
    })
  })
}
