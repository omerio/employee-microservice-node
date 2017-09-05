const logger = require('../logger')

// crash check
const crash = {
  method: 'GET',
  path: '/error/crash',
  config: {
    tags: ['api'],
    description: 'Cause node.js to crash',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' }
        }
      }
    }
  },
  handler: function (request, reply) {
    setTimeout(function () {
      logger.error('Fatal error has occured, server is exiting!')
      process.exit()
    }, 3000)
    reply()
  }
}

// freeze check
const freeze = {
  method: 'GET',
  path: '/error/freeze',
  config: {
    tags: ['api'],
    description: 'Cause node.js to become unresponsive',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          200: { description: 'Success' }
        }
      }
    }
  },
  handler: function (request, reply) {
    setTimeout(function () {
      logger.warn('Server is going into an infinite loop!')
      while (true) {
      }
    }, 3000)
    reply()
  }
}

module.exports = { freeze, crash }
