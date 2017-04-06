/**
 * Represents an HTTP server that serves the client from /dev.
 *
 * @author Roelof Roos <github@roelof.io>
 */

const path = require('path')
const fs = require('fs')
const root = require('app-root-path')

const finalhandler = require('finalhandler')
const http = require('http')
const winston = require('winston')

const Router = require('router')
const Twig = require('twig')

let assetPath = (name) => {
  return path.join(String(root), 'dev', name)
}

/**
 * Returns a Twig template, rendered and all
 *
 * @param  {String} file Name of the file, '.html.twig' is appended
 *                       automatically
 * @param  {Array}  args Arguments for the template
 */
let returnTwig = (file, args) => {
  // Build arguments for Twig
  if (typeof args !== 'object') args = []

  args.env = process.env
  args.server = {
    host: process.env.SOCKET_HOST || 'localhost',
    port: process.env.SOCKET_PORT || 8080
  }

  // Build file path
  let filePath = assetPath(`${file}.html.twig`)

  // Build response promise
  return new Promise((resolve, reject) => {
    Twig.renderFile(filePath, args, (err, html) => {
      err ? reject(err) : resolve(html)
    })
  })
}

let buildTwigRender = (filename) => {
  return (req, res, next) => {
    returnTwig(filename, []).then((html) => {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8'
      })
      res.end(html, 'utf-8', next)
    }).catch((err) => {
      winston.error(err)
      next(err)
    })
  }
}

let buildJsRender = (filename) => {
  return (req, res, next) => {
    fs.readFile(assetPath(filename), (err, content) => {
      if (err) {
        winston.error(err)
        next(err)
      } else {
        res.writeHead(200, {
          'Content-Type': 'application/javascript; charset=utf-8'
        })
        res.end(content, 'utf-8', next)
      }
    })
  }
}

/**
 * Builds a server with a router for the development assets.
 *
 * @return {net.Server}
 */
let buildDevServer = () => {
  // Create router
  let router = new Router()

  // Print client.html.twig on /
  router.get('/', buildTwigRender('client'))

  // Print javascript code on /code.js
  router.get('/code.js', buildJsRender('client.js'))
  router.get('/base.js', buildJsRender('log-helper.js'))

  // Return the server, linked to our handler
  return http.createServer((req, res) => {
    router(req, res, finalhandler(req, res))
  })
}

/**
 * Builds a production server, which has no pages and returns 403 on everything
 *
 * @return {net.Server}
 */
let buildProdServer = () => {
  return http.createServer((req, res) => {
    res.writeHead(403)
    res.end()
  })
}

module.exports = () => {
  let nodeEnv = process.env.NODE_ENV || 'test'
  if (nodeEnv.match(/^prod(uction)?$/)) {
    return buildProdServer()
  } else {
    return buildDevServer()
  }
}
