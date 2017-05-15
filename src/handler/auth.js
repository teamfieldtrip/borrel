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

const logout = function (data, callback) {
  database.connection.models.account.findOne({ where: { token: data.token }
  }).then((account) => {
    account.update({
      token: null
    })
    callback(null)
  }).catch((error) => {
    winston.error('Cannot find account')
    callback('error_cant_find_account')
  })
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

const REG_ERR = {
  generic: 'Something went wrong, try again.',
  nameEmpty: 'empty-name',
  nameShort: 'short-name',
  passEmpty: 'empty-pass',
  passShort: 'short-pass',
  mailEmpty: 'empty-mail',
  mailInvalid: 'invalid-email',
  mailTaken: 'taken-email'
}

let register = (data, callback) => {
  // Check if the data is an object, otherwise we cannot use the values
  if (typeof data !== 'object') {
    return callback(REG_ERR.generic)
  }

  // Get variables
  let name = (data.name || '').toString().trim()
  let email = (data.email || '').toString().trim().toLowerCase()
  let password = (data.password || '').toString()

  // Validate submitted values.
  if (name.length < 4) {
    return callback(name.length === 0 ? REG_ERR.nameEmpty : REG_ERR.nameShort)
  }
  if (email.length === 0) {
    return callback(REG_ERR.mailEmpty)
  }
  if (password.length < 4) {
    return callback(password.length === 0 ? REG_ERR.passEmpty : REG_ERR.passShort)
  }
  if (!validator.isEmail(email)) {
    return callback(REG_ERR.mailInvalid)
  }

  // Keep a short reference to the models
  const models = database.connection.models

  // Find an account with the given e-mail address
  models.account.findOne({
    where: {email: email}
  }).then((result) => {
    // If we find an account, abort
    if (result !== null) {
      return callback(REG_ERR.mailTaken)
    }

    // Create new user, and sign it in. The system sends a new JWT token.
    models.account.build({
      name: name,
      email: email,
      password: password
    }).save().then((account) => {
      loginUser(account, callback)
    }, (err) => {
      winston.error(err)
      if (typeof err === 'object' && err.message) {
        callback(err.message)
      } else {
        callback(err)
      }
    })
  })
}

/**
 * Exports the methods we want to provide
 * @type {Object}
 */
module.exports = {login, logout, register}
