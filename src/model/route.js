/**
 * Utility models for the router
 *
 * @author Roelof Roos <gitub@roelof.io>
 * @author Remco Schipper <gitub@remcoschipper.com>
 */
const states = require('../constant/state')

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

module.exports = Route;
