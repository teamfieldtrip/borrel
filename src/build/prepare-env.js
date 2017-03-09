/**
 * Prepares an environment file
 *
 * @author Roelof Roos
 */

(function () {
  var winston = require('winston')
  let fs = require('fs')
  let root = require('app-root-path')

  var exists = function (file) {
    let fs = require('fs')
    try {
      let stat = fs.statSync(file)
      return stat.isFile()
    } catch (error) {
      return false
    }
  }

  let envFile = `${root}/.env`
  let envSourceFile = `${root}/.env.example`

  let envFileExists = exists(envFile)
  let envSourceFileExists = exists(envSourceFile)

  if (envFileExists) {
    process.exit(0)
    return
  }

  if (!envSourceFileExists) {
    winston.error(`Cannot find dotenv base file at ${envSourceFile}...`)
    process.exit(1)
    return
  }

  winston.log(`Creating default dotenv file at ${envFile}`)
  fs.readFile(envSourceFile, 'utf8', function (err, data) {
    if (err) {
      winston.error(`Failed to read ${envSourceFile}: `, err)
      process.exit(err.code || 1)
      return
    }

    winston.debug(`Read data from ${envSourceFile}.`)
    winston.debug(`Writing data to ${envFile}...`)
    fs.writeFile(envFile, data, {mode: 0o644}, function (err, data) {
      if (!err) {
        winston.log(`Created .env file.`)
      } else {
        winston.error(`Failed to read ${envSourceFile}: `, err)
        process.exit(err.code || 1)
      }
    })
  })
}())
