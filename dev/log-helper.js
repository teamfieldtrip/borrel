/**
 * Helps logging stuff
 *
 * @author Roelof Roos <github@roelof.io>
 */

window.app = (function () {
  'use strict'

  /**
   * @type {DOMNode}
   */
  let logNode

  /**
   * Four lines on default font size.
   * @type {Number}
   */
  const fourLines = 16 * 4

  /**
   * Max number of lines in the log. Oldest are removed
   * @type {Number}
   */
  const maxLogLines = 200

  /**
   * Gives a timeout for auto cleaning old entries
   * @type {Timeout}
   */
  let cleanTimeout = null

  /**
   * Adds a zero to make sure the character is 2 characters wide.
   * 12 -> 12
   * 3 -> 03
   *
   * @param  {Number} val
   * @return {String}
   */
  let zeroFill = (val) => {
    return val < 10 ? `0${val}` : val
  }

  /**
   * Constructs a timestamp
   *
   * @return {String}
   */
  let buildDate = () => {
    let now = new Date()
    return [
      zeroFill(now.getHours()),
      zeroFill(now.getMinutes()),
      zeroFill(now.getSeconds())
    ].join(':')
  }

  let buildNodeName = (node) => {
    let args = [
      node.nodeName.toLowerCase()
    ]
    let id = node.attributes.getNamedItem('id')
    if (id && id.value.length > 0) {
      args.push(`#${id.value}`)
    }
    let classList = node.classList
    if (node.className.length > 0) {
      classList.forEach((className) => {
        args.push(`.${className}`)
      })
    }
    let name = node.attributes.getNamedItem('name')
    if (name && name.value.length > 0) {
      args.push(`[name="${name.value}"]`)
    }
    return `[${args.join('')}]`
  }

  /**
   * Removes excess log entries
   */
  let autoClean = () => {
    while (logNode.childNodes.length > maxLogLines) {
      logNode.removeChild(logNode.firstChild)
    }
  }

  /**
   * Debounces the cleaning up of the log until it's quiet.
   */
  let listUpdated = () => {
    if (cleanTimeout !== null) {
      clearTimeout(cleanTimeout)
    }
    cleanTimeout = setTimeout(autoClean, 500)
  }

  /**
   * Scrolls to the end of the log if the user isn't more than 4 lines away
   * from the bottom.
   */
  let scrollToEnd = () => {
    let logScrollHeight = logNode.scrollHeight
    let logElemHeight = logNode.offsetHeight
    let logScrollPos = logNode.scrollTop
    let dist = logScrollHeight - (logScrollPos + logElemHeight)

    if (dist < fourLines) {
      logNode.scrollTop = logNode.scrollHeight
    }
  }

  let createLogNode = (className, content) => {
    let node = document.createElement('span')
    node.classList.add('log-item')
    if (className) {
      node.classList.add(className)
    }
    node.textContent = content
    return node
  }

  let convertObjectToLogNode = (item) => {
    // Edge cases
    let itemType = typeof item
    if (item instanceof window.HTMLElement) {
      itemType = 'HTMLElement'
    } else if (item === null || item === undefined) {
      itemType = item === null ? 'null' : 'undefined'
    }

    let node
    // Switch all items
    switch (itemType) {
      case 'number':
        node = createLogNode('text-warning', item)
        break
      case 'boolean':
        node = createLogNode('text-primary', item ? 'true' : 'false')
        break
      case 'HTMLElement':
        node = createLogNode('text-success', buildNodeName(item))
        break
      case 'object':
        node = createLogNode('text-info', JSON.stringify(item))
        break
      case 'function':
        node = createLogNode('text-success', `[Function ${item.name}]`)
        break
      case 'null':
      case 'undefined':
        node = createLogNode('text-muted', itemType)
        break
      default:
        node = createLogNode(null, String(item))
    }

    return node
  }

  let convertArray = (array) => {
    let nodeList = []
    nodeList.push(createLogNode('text-info', '['))
    array.forEach((node) => {
      nodeList.push(convertObjectToLogNode(node))
    })
    nodeList.push(createLogNode('text-info', ']'))

    return nodeList
  }

  /**
   * Logs anything, sends it to the console and the on-screen log.
   */
  let log = function () {
    let args = []
    for (var i = 0; i < arguments.length; i++) {
      args.push(arguments[i])
    }
    console.log.apply(this, args)

    let container = document.createElement('div')
    container.classList.add('log-block')

    let timestamp = document.createElement('div')
    timestamp.classList.add('log-block__time', 'text-muted')
    timestamp.textContent = buildDate()

    let itembox = document.createElement('div')
    itembox.classList.add('log-block__main')

    container.appendChild(timestamp)
    container.appendChild(itembox)

    let nodeList = []
    args.forEach((item) => {
      if (Object.prototype.toString.call(item) === '[object Array]') {
        nodeList = nodeList.concat(convertArray(item))
      } else {
        nodeList.push(convertObjectToLogNode(item))
      }
    })

    nodeList.forEach((node) => {
      itembox.appendChild(node)
    })

    logNode.appendChild(container)

    // Scroll to bottom if we're at the bottom
    scrollToEnd()

    // Flush old entries after a timeout
    listUpdated()
  }

  // data-target="log-clear"

  /**
   * Runs when the page is ready
   */
  let init = function () {
    logNode = document.querySelector('[data-content=log]')
    document.querySelector('[data-clear=log]').addEventListener('click', () => {
      logNode.innerHTML = ''
    })
  }

  document.addEventListener('DOMContentLoaded', init)

  return {
    log: log
  }
}())
