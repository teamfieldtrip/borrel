/**
 * Utility models for the router
 *
 * @author Roelof Roos <gitub@roelof.io>
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

/**
 * Describes a simple route with a name, function and required user state
 * @type {Route}
 */
class Route {
  constructor (name = null, func = null, state = states.all) {
    this.name = typeof name === 'string' ? name : ''
    this.func = typeof func === 'function' ? func : () => {}
    this.state = typeof state === 'number' ? state : states.all
  }
}

module.exports = {
  route: Route,
  states: states
}
