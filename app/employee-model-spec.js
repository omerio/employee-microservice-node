/* eslint-env mocha */

import {expect} from 'chai'
const Employee = require('./employee-model')

const data = {
  employeeNumber: 12345678,
  firstname: 'John',
  lastname: 'Smith',
  grade: 'AB1',
  birthDate: '1980-01-23',
  joinDate: '2015-05-12',
  salary: 25000,
  email: 'john.smith@gmail.com'
}

describe('Employee', function () {
  describe('#constructor()', function () {
    it('should return a new sanitized Employee object', function () {
      let testData = Object.assign({ password: 'testing123' }, data)
      let employee = new Employee(testData)
      expect(employee).to.not.be.a('null')
      expect(employee).to.be.eql(data)
      expect(employee.password).to.be.an('undefined')
      expect(employee).to.not.have.any.keys('password')
    })
  })

  describe('#valid()', function () {
    it('should return false for missing firstname', function () {
      let testData = Object.assign({ }, data)
      testData.firstname = undefined
      let employee = new Employee(testData)
      expect(employee).to.not.be.a('null')
      expect(employee.valid()).to.be.false
    })

    it('should return false for invalid grade', function () {
      let testData = Object.assign({ }, data)
      testData.grade = 'THG123'
      let employee = new Employee(testData)
      expect(employee).to.not.be.a('null')
      expect(employee.valid()).to.be.false
    })

    it('should return false for invalid email', function () {
      let testData = Object.assign({ }, data)
      testData.email = 'test.test'
      let employee = new Employee(testData)
      expect(employee).to.not.be.a('null')
      expect(employee.valid()).to.be.false
    })

    it('should return true for a valid Employee object', function () {
      let employee = new Employee(data)
      expect(employee).to.not.be.a('null')
      expect(employee.valid()).to.be.true
    })
  })
})
