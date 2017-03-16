const config = require('../config')
const request = require('request')
const logger = require('../logger')
const Employee = require('./employee-model')

// TODO read data from database
// we use static data for now
let data = [new Employee({
  employeeNumber: 19657899,
  firstname: 'John',
  lastname: 'Smith',
  grade: 'AB1',
  birthDate: '1980-01-23',
  joinDate: '2015-05-12',
  salary: 25000,
  email: 'john.smith@gmail.com'
}), new Employee({
  employeeNumber: 11457844,
  firstname: 'Hannah',
  lastname: 'Prior',
  grade: 'AB7',
  birthDate: '1976-11-10',
  joinDate: '2004-07-01',
  salary: 45000,
  email: 'hannah@gmail.com'
})]

const service = {
  getAll: function () {
    logger.info('Retrieving all employees')
    return new Promise(function (resolve, reject) {
      if (data) {
        resolve(data)  // fulfilled successfully
      } else {
        logger.warn('No employee are found')
        reject('NOT_FOUND' /* reason */)  // error, rejected
      }
    })
  },
  /**
   * Return a promise that resolve to an Employee with the provided
   * employeeNumber, the bonus is calculated and returned as well
   * @param  {Number} employeeNumber employee number
   * @return {Promise}               employee promise
   */
  get: function (employeeNumber) {
    logger.info('Retrieving employee with employeeNumber: ' + employeeNumber)
    return new Promise(function (resolve, reject) {
      // find the employee
      let employee = data.find(x => x.employeeNumber === employeeNumber)
      if (typeof employee === 'undefined') {
        logger.warn(`Employee with employeeNumber: ${employeeNumber} is not found`)
        reject('NOT_FOUND')
        return
      }
      // get the bonus for the employee
      // we are using the request module
      if (config.bonus.enabled) {
        request.post({
          url: config.bonus.url, // URL to hit
          json: employee
        }, (error, response, body) => {
          if (error) {
            logger.error('Failed to retrieve the bonus from the bonus service' + error)
            reject(error)
          } else {
            // add bonus to employee
            employee = Object.assign(body, employee)
            resolve(employee)
          }
        })
      } else {
        employee = Object.assign({bonus: 0}, employee)
        resolve(employee)
      }
    })
  },
  edit: function (employeeNumber, employee) {
    logger.info(`Editing employee with employeeNumber: ${employeeNumber},
      data: ${JSON.stringify(employee)}`)
    return new Promise(function (resolve, reject) {
      employee = new Employee(employee)
      if (!employee.valid()) {
        logger.error('Invalid employee object')
        reject('INVALID')
        return
      }
      // find the employee
      let dbEmployee = data.find(x => x.employeeNumber === employeeNumber)
      if (typeof dbEmployee === 'undefined') {
        logger.warn(`Employee with employeeNumber: ${employeeNumber} is not found`)
        reject('NOT_FOUND')
        return
      }

      Object.assign(dbEmployee, employee)
      dbEmployee.employeeNumber = employeeNumber
      resolve('SUCCESS')
    })
  },
  add: function (employee) {
    logger.info('Adding a new employee: ' + JSON.stringify(employee))
    return new Promise(function (resolve, reject) {
      employee = new Employee(employee)
      if (!employee.valid()) {
        logger.error('Invalid employee object')
        reject('INVALID')
        return
      }

      let employeeNumber = Math.floor(Math.random() * 90000000) + 10000000
      if (data) {
        employee.employeeNumber = employeeNumber
        data.push(employee)
        resolve(employee)  // fulfilled successfully
      } else {
        reject('FAILURE')  // error, rejected
      }
    })
  },
  del: function (employeeNumber) {
    logger.info('Deleting employee with employeeNumber: ' + employeeNumber)
    return new Promise(function (resolve, reject) {
      // find the employee
      let dbEmployee = data.find(x => x.employeeNumber === employeeNumber)
      if (typeof dbEmployee === 'undefined') {
        logger.warn(`Employee with employeeNumber: ${employeeNumber} is not found`)
        reject('NOT_FOUND')
        return
      }

      data.splice(data.indexOf(dbEmployee), 1)
      resolve('SUCCESS')
    })
  },
  /**
   * used for unit testing
   */
  setData (newData) {
    data = newData
  },
  getData () {
    return data
  }
}

module.exports = service
