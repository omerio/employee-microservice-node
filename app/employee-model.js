const _ = require('lodash')
const joi = require('joi')

// declared using ES6 classes https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Classes
class Employee {
  constructor (data) {
    let sanitized = Employee.sanitize(data)
    Object.assign(this, sanitized)
  }

  valid () {
    let result = joi.validate(this, Employee.schema())
    return result.error === null
  }

  static sanitize (data) {
    data = data || {}
    return _.pick(_.defaults(data, Employee.schema()), _.keys(Employee.schema()))
  }

  // schema validation using joi
  static schema () {
    return {
      employeeNumber: joi.number().integer(),
      firstname: joi.string().alphanum().min(3).max(30).required(),
      lastname: joi.string().alphanum().min(3).max(30).required(),
      grade: joi.string().regex(/^[a-zA-Z0-9]{3}$/).required(),
      birthDate: joi.date().raw().required(),
      joinDate: joi.date().raw().required(),
      salary: joi.number().required(),
      email: joi.string().email()
    }
  }
}

module.exports = Employee
