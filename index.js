const hapi = require('hapi')
const swagger = require('hapi-swagger')
const inert = require('inert')
const vision = require('vision')
const good = require('good')

const config = require('./config')
const logger = require('./logger')
const routes = require('./app/routes')

// create the server
const server = new hapi.Server()

// set connection host/port and enable CORS
server.connection({
  host: '0.0.0.0',
  port: config.server.port,
  routes: {
    cors: true
  }
})

// hock up all the routes
routes.register(server)

// swagger configurations
const swaggerPlugin = {
  register: swagger,
  options: {
    info: {
      title: 'Employee Microservice API Documentation',
      version: config.api.version
    },
    documentationPath: config.api.docs
  }
}

const plugins = [
  inert,
  vision,
  swaggerPlugin
]

// is the server logging enabled?
if (config.server.logging.enabled) {
  plugins.push({
    register: good,
    options: {
      reporters: {
        consoleReporter: [{
          module: 'good-squeeze',
          name: 'Squeeze',
          args: [{ log: '*', response: '*', error: '*' }]
        }, {
          module: 'good-console'
        }, 'stdout']
      }
    }
  })
}

// register plugins and start the server on the callback if all is good
server.register(plugins, (err) => {
  if (err) throw err

  server.start((startErr) => {
    if (startErr) {
      throw startErr
    }

    logger.info(`Server is running:`, { pid: process.pid, uri: server.info.uri })
  })
})

module.exports = server
