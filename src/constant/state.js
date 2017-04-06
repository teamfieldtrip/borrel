/**
 * User states used in the route process
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */
const lodash = require('lodash')

/**
 * Various user states.
 * @type {Object}
 */
const states = {
  guest: 1,
  user: 2,
  lobby: 4,
  game: 8
}
states.all = lodash.sum(lodash.values(states))
states.auth = states.all & ~states.guest

module.exports = states
