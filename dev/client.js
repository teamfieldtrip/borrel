/* eslint-env browser, jquery */
/* global io */
/**
 * Handles connecting to the socket and supporting features
 *
 * @author Roelof Roos <github@roelof.io>
 * @author Remco Schipper <github@remcoschipper.com>
 */

(function ($) {
  'use strict'
  // Internet Exploder check
  if (typeof Promise === 'undefined' || Promise.toString().indexOf('[native code]') === -1) {
    var err = new Error('Internet Explorer donder op!')
    console.error(err)
    alert(err)
    throw err
  }

  let socket = null
  let statusIndicators = {
    socket: null,
    token: null,
    account: null,
    player: null,
    game: null
  }

  let log = function () {
    window.app.log.apply(this, arguments)
  }
  /**
   * Returns a config entry from the <body> tag.
   *
   * @param  {String} key key to get
   * @param  {mixed} fallback default value if key isn't set
   * @return {mixed} the value, or fallback
   */
  let getConfig = (key, fallback) => {
    let bodyElement = document.querySelector('body')
    if (bodyElement.dataset[key]) {
      return bodyElement.dataset[key]
    } else {
      return fallback || null
    }
  }

  /**
   * Finds a data-content node with the given name, and then selects the first
   * span element in it.
   * @param  {String} selector Selector, value of the data-content element.
   * @return {DOMNode}
   */
  let findStatusIndicator = (selector) => {
    let node = document.querySelector(`[data-status-for="${selector}"]`)
    if (node) {
      let text = document.createElement('span')
      text.classList.add('text-muted')
      text.textContent = '[unknown]'
      node.appendChild(text)
    }
    return node
  }

  /**
   * Handles submission of the form
   *
   * @param  {Event} event Submit event
   * @this   {DOMElement}
   */
  let submitSocketForm = (node, event) => {
    if (event) event.preventDefault()
    if (!node) {
      log('Cannot submit form! No {node},', node)
      return
    }

    let data = {}
    let rawData = $(node).serializeArray()

    rawData.forEach((row) => {
      data[row.name] = row.value
    })

    if (socket) {
      let action = node.dataset['socketAction']
      log('Emitting', action, 'with', data)
      socket.emit(action, data)
    } else {
      log('ERROR! Not connected to socket!')
    }
  }

  let bindForms = () => {
    let formNodes = document.querySelectorAll('form[data-socket-action]')
    formNodes.forEach((node) => {
      node.addEventListener('submit', (event) => {
        submitSocketForm(node, event)
      })
    })
  }

  /**
   * Sends poll data with the connection status and a timestamp to the server.
   */
  let sendPoll = () => {
    let pollData = {
      status: socket.connected,
      timestamp: new Date()
    }

    socket.emit('poll', pollData)
    log(pollData)
  }

  /**
   * Logs any kind of event on the socket handler to the log
   *
   * @param {io.Socket} socket
   */
  let attachLoggers = (socket) => {
    let events = [
      ['connect', false, 'success'],
      ['connect_error', true, 'danger'],
      ['connect_timeout', true, 'danger'],
      ['error', true, 'danger'],
      ['disconnect', false, 'primary'],
      ['reconnect', false, 'warning'],
      ['reconnect_attempt', false, 'warning'],
      ['reconnecting', false, 'warning'],
      ['reconnect_error', true, 'danger'],
      ['reconnect_failed', true, 'danger'],
      ['message', false, 'muted']
    ]

    // Loops through each event, sending errors as Error events
    events.forEach((data) => {
      let eventName = data[0]
      let errorEvent = data[1] === true
      let className = data[2]

      socket.on(eventName, () => {
        // Update status node
        if (statusIndicators.socket) {
          statusIndicators.socket.className = `status-item__value text-${className}`
          statusIndicators.socket.textContent = eventName
        }

        // Build an array of arguments, since we're lazy :p
        let args = [`${eventName} event; `]
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i])
        }

        // Make the name an error, in case we're talking about an error
        if (errorEvent === true) {
          args[0] = new Error(args[0])
        }
        log.apply(this, args)
      })
    })
  }

  let failConnection = (err) => {
    log('Connetion failed!', err)
  }

  /**
   * Connects the socket to the server.
   */
  let retrieveConnection = () => {
    if (socket !== null) {
      log('Reusing previously conneted socket.')
      return Promise.resolve(socket)
    }

    // Provided by server
    let host = getConfig('socketHost', 'localhost')
    let port = getConfig('socketPort', 8080)

    return new Promise((resolve, reject) => {
      // Log
      log(`Constructing new connection to ${host}:${port}...`)

      // Build socket URL
      socket = io(`ws://${host}:${port}`)

      // Attach loggers early
      attachLoggers(socket)

      // Add event listeners
      socket.on('connect', () => {
        log(`Connected to ${host}`)
        resolve(socket)
      })
      socket.on('error', (err) => {
        log(`Failed to connect to ${host}`, err)
        reject(err)
      })
    })
  }

  /**
   * Runs when the page is ready
   */
  let init = function () {
    retrieveConnection()
      .catch(failConnection)
      .then(attachLoggers)
      .then(sendPoll)

    // Bind status indicators
    statusIndicators.socket = findStatusIndicator('socket-status')
    statusIndicators.token = findStatusIndicator('jwt')
    statusIndicators.account = findStatusIndicator('account-id')
    statusIndicators.player = findStatusIndicator('player-id')
    statusIndicators.game = findStatusIndicator('game-id')

    // Bind actions
    bindForms()
  }

  document.addEventListener('DOMContentLoaded', init)
}(window.jQuery))
