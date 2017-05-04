/**
 * Handles the authentication events from the socket
 *
 * @author Remco Schipper <github@remcoschipper.com>
 */
const jwt = require('jsonwebtoken')
const database = require('../lib/database')
const validator = require('validator')
const winston = require('winston')

/**
 * Creates a new JSON web token, stores it and signs in the user.
 *
 * @param  {Account}  account  Account to sign in to
 * @param  {Function} callback Callback to send the response in
 */
const loginUser = (account, callback) => {
  // Generate a token
  const token = jwt.sign({ id: account.id }, process.env.JWT_SECRET)

  // Persist the token
  account.update({
    token: token
  }).then(() => {
    return callback(null, token)
  }).catch((error) => {
    winston.error(error)
    return callback('Could not update the account instance')
  })
}

const ERR_LOGIN = {
  generic: 'Wrong email/password',
  nomail: 'Please enter an e-mail address',
  nopass: 'Please enter a password'
}

const login = function (data, callback) {
  // Check if the callback is set, otherwise the call will cause an error
  callback = (typeof callback === 'function') ? callback : function () {}

  // Check if the data is an object, otherwise we cannot use the values
  if (typeof data !== 'object') {
    return callback(ERR_LOGIN.generic)
  }

  // Get a case-insensitive version of the email address
  let email = (data.email || '').toString().trim().toLowerCase()
  let password = (data.password || '').toString()

  // Make sure both fields are filled in
  if (email.length === 0 || !validator.isEmail(email)) {
    return callback(ERR_LOGIN.nomail)
  } else if (password.length === 0) {
    return callback(ERR_LOGIN.missing)
  }

  // Keep a short reference to the models
  const models = database.connection.models
  models.account.findOne({ where: { email: email } }).then((account) => {
    // Check if the account exists
    if (typeof account === 'undefined' || account === null) {
      return callback(ERR_LOGIN.generic)
    }
    // Check if the password matches
    account.passwordMatches(password).then((result) => {
      if (!result) {
        return callback(ERR_LOGIN.generic)
      }

      loginUser(account, callback)
    }).catch((error) => {
      console.log(error)
      return callback(ERR_LOGIN.generic)
    })
  }).catch((error) => {
    console.log(error)
    return callback(ERR_LOGIN.generic)
  })
}

/**
 * Exports the methods we want to provide
 * @type {Object}
 */
module.exports = {login}
