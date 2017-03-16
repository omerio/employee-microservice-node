const hapi = require('hapi')
const swagger = require('hapi-swagger')
const inert = require('inert')
const vision = require('vision')

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
const swaggerOptions = {
  info: {
    title: 'Employee Microservice API Documentation',
    version: config.api.version
  },
  documentationPath: config.api.docs
}

// register plugins and start the server on the callback if all is good
server.register([
  inert,
  vision, {
    register: swagger,
    options: swaggerOptions
  }
], (err) => {
  if (err) throw err

  server.start((startErr) => {
    if (startErr) {
      throw startErr
    }

    logger.info(`Server is running:`, { pid: process.pid, uri: server.info.uri })
  })
})

module.exports = server
