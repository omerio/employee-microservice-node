// eslint-disable no-useless-computed-key
const joi = require('joi')
const Boom = require('boom')
const service = require('./employee-service')
const Employee = require('./employee-model')
const pack = require('../package.json')
const errors = require('./error-simulator-api')

// health check
const health = {
  method: 'GET',
  path: '/health',
  config: {
    tags: ['api'],
    description: 'Health check API',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: joi.object({
              status: joi.string().description('Microservice status').example('ok'),
              version: joi.string().description('Microservice version').example('1.0.0')
            })
          },
          400: { description: 'Bad Request' },
          500: { description: 'Internal Error' }
        }
      }
    }
  },
  handler: function (request, reply) {
    reply({
      status: 'ok',
      version: pack.version
    })
  }
}

const get = {
  method: 'GET',
  path: '/employee',
  config: {
    tags: ['api'],
    description: 'Get all employees',
    notes: 'Get all employees',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            // TODO return an array of Employees
            schema: joi.object(Employee.schema()).label('Employee')
          },
          500: { description: 'Internal Error' }
        }
      }
    }
  },
  handler: function (request, reply) {
    let result = service.getAll()
    // return reply() is best practice https://github.com/hapijs/hapi/issues/2168
    result.then((employees) => {
      return reply(employees)
    }).catch(err => {
      if (err === 'NOT_FOUND') {
        return reply(Boom.notFound())
      } else {
        return reply(new Error(err))
      }
    })
  }
}

const getByEmployeeNumber = {
  method: 'GET',
  path: '/employee/{employeeNumber}',
  config: {
    tags: ['api'],
    description: 'Get employee by employeeNumber',
    notes: 'Get employee by employeeNumber, returns the bonus as well',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: joi.object(
              Object.assign({ bonus: joi.number() }, Employee.schema())
            ).label('Employee')
          },
          400: {description: 'Bad request'},
          404: {description: 'Employee does not exist'},
          500: { description: 'Internal Error' }
        }
      }
    },
    validate: {
      params: {
        employeeNumber: joi.number().integer()
      }
    }
  },
  handler: function (request, reply) {
    let result = service.get(request.params.employeeNumber)
    // return reply() is best practice https://github.com/hapijs/hapi/issues/2168
    result.then((employee) => {
      return reply(employee)
    }).catch((err) => {
      if (err === 'NOT_FOUND') {
        return reply(Boom.notFound())
      } else {
        return reply(new Error(err))
      }
    })
  }
}

const post = {
  method: 'POST',
  path: '/employee',
  config: {
    tags: ['api'],
    description: 'Create a new employees',
    notes: 'Create a new employees',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          200: {
            description: 'Success',
            schema: joi.object(Employee.schema()).label('Employee')
          },
          400: {description: 'Bad request'},
          500: { description: 'Internal Error' }
        }
      }
    },
    validate: {
      options: {
        allowUnknown: false
      },
      payload: Employee.schema()
    }
  },
  handler: function (request, reply) {
    let payload = request.payload
    let result = service.add(payload)
    result.then((employee) => {
      return reply(employee)
    }).catch((err) => {
      return reply(new Error(err))
    })
  }
}

const put = {
  method: 'PUT',
  path: '/employee/{employeeNumber}',
  config: {
    tags: ['api'],
    description: 'Update an existing employees',
    notes: 'Update an existing employees',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          204: { description: 'Success' },
          400: { description: 'Bad request' },
          404: {description: 'Employee does not exist'},
          500: { description: 'Internal Error' }
        }
      }
    },
    validate: {
      options: {
        allowUnknown: false
      },
      payload: Employee.schema(),
      params: {
        employeeNumber: joi.number().integer()
      }
    }
  },
  handler: function (request, reply) {
    let payload = request.payload
    let result = service.edit(request.params.employeeNumber, payload)
    result.then((response) => {
      return reply().code(204)
    }).catch((err) => {
      if (err === 'NOT_FOUND') {
        return reply(Boom.notFound())
      } else {
        return reply(new Error(err))
      }
    })
  }
}

const del = {
  method: 'DELETE',
  path: '/employee/{employeeNumber}',
  config: {
    tags: ['api'],
    description: 'Delete an employee',
    notes: 'Delete an employee by employeeNumber',
    plugins: {
      // Swagger model definition
      'hapi-swagger': {
        responses: {
          204: { description: 'Success' },
          404: { description: 'Employee does not exist' },
          500: { description: 'Internal Error' }
        }
      }
    },
    validate: {
      params: {
        employeeNumber: joi.number().integer()
      }
    }
  },
  handler: function (request, reply) {
    let result = service.del(request.params.employeeNumber)
    // return reply() is best practice https://github.com/hapijs/hapi/issues/2168
    result.then((response) => {
      return reply().code(204)
    }).catch((err) => {
      switch (err) {
        case 'NOT_FOUND':
          reply(Boom.notFound())
          break
        default:
          reply(new Error(err))
      }
    })
  }
}

const freeze = errors.freeze
const crash = errors.crash

module.exports = {
  routes: [ health, crash, freeze, get, getByEmployeeNumber, post, put, del ],
  freeze,
  crash,
  health,
  get,
  getByEmployeeNumber,
  post,
  put,
  del
}
