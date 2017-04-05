/**
 * Helps logging stuff
 *
 * @author Roelof Roos <github@roelof.io>
 */

window.app = (function () {
  'use strict'

  /**
   * @var DOMNode
   */
  let logNode

  /**
   * Adds a zero to make sure the character is 2 characters wide.
   * 12 -> 12
   * 3 -> 03
   *
   * @param  {number} val
   * @return {string}
   */
  let zeroFill = function (val) {
    return val < 10 ? `0${val}` : val
  }

  /**
   * Constructs a timestamp
   *
   * @return {string}
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

    args.forEach((item) => {
      let node = document.createElement('span')
      node.classList.add('log-item')

      // Edge cases
      let itemType = typeof item
      if (item instanceof window.HTMLElement) {
        itemType = 'HTMLElement'
      } else if (item === null || item === undefined) {
        itemType = item === null ? 'null' : 'undefined'
      }

      // Switch all items
      switch (itemType) {
        case 'number':
          node.classList.add('text-warning')
          break
        case 'boolean':
          node.textContent = item ? 'true' : 'false'
          node.classList.add('text-primary')
          break
        case 'HTMLElement':
          node.textContent = buildNodeName(item)
          node.classList.add('text-success')
          break
        case 'object':
          node.textContent = JSON.stringify(item)
          node.classList.add('text-info')
          break
        case 'function':
          node.textContent = `[Function ${item.name}]`
          node.classList.add('text-success')
          break
        case 'null':
        case 'default':
          node.textContent = itemType
          node.classList.add('text-success')
          break
        default:
          node.textContent = String(item)
      }

      itembox.appendChild(node)
    })
    logNode.appendChild(container)
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
