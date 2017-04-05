/* eslint-disable no-unused-vars */
/**
 * General route list controller
 *
 * @author Roelof Roos <gitub@roelof.io>
 * @author Remco Schipper
 */

// Requirements for controller
const lodash = require('lodash')
const Route = require('../lib/route').route
const states = require('../lib/route').states

// Requirements for routes
const auth = require('../handler/auth')
const player = require('../handler/player')

/**
 * A router handler, has some utility funtions
 *
 * @type {Object}
 */
class RouteController {
  constructor (socket) {
    this.routes = {}
  }

  /**
   * Links a socket to this RouteController
   *
   * @param  {io.Server} socket
   */
  linkSocket (socket) {
    if (typeof socket !== 'object') throw new Error('Invalid socket!')

    socket.on('connect', this.connectClient.bind(this))
  }

  /**
   * [connectClient description]
   * @param  {[type]} client [description]
   */
  connectClient (client) {
    // Make sure the user has a data store
    client.data = client.data || {}
    client.data.state = states.guest

    // Bind all routes to our own handler
    lodash.forOwn(this.routes, (route, routeName) => {
      client.on(routeName, this.handleRoute.bind(this, route, client))
    })
  }

  /**
   * Handles a route by checking the state of the user to see if the user is
   * authorised and checks for certain values to be valid.
   *
   * @param  {Route} route
   * @param  {io.Client} client
   * @param  {Object} data
   * @param  {Function} callback
   */
  handeRoute (route, client, data, callback = null) {
    // Callback must be a function, or shit will go wrong.
    callback = (typeof callback === 'function') ? callback : () => {}

    // Make sure the current scope is sufficient
    if (this.canUse(route.name, client)) {
      route.fn.apply(client, data, callback)
    } else {
      callback('Not authorized')
    }
  }

  /**
   * Registers a new route with the given name, function and scope
   * @param {String} name Name of the router, usually in <namespace>:<method>
   *                      form
   * @param {Function} func Function that gets called for this route
   * @param {Number} scope User scopes that are allowed to access this route
   * @return {this} Returns this class for chaining
   */
  addRoute (name, func, scope) {
    // Create a new route instance, since models are cool
    this.routes[name] = new Route(name, func, scope)
    return this
  }

  canUse (name, client) {
    let route = name instanceof Route ? name : this.routes[name]
    return (route.scope & client.data.state !== 0)
  }
}

// Create non-changing instance :D
let router = new RouteController()

// Register all routes
router
  // Auth
  .addRoute('auth:login', auth.login, states.guest)
  .addRoute('auth:register', auth.register, states.guest)
  // Player sessions
  .addRoute('player:create', player.create, states.auth)
  .addRoute('player:resume', player.resume, states.auth)

console.log(router)

// Export router
module.export = router
