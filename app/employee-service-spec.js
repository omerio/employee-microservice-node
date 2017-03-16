/* eslint-env mocha */

import {expect} from 'chai'
const request = require('request')
const service = require('./employee-service')
const config = require('../config')
const logger = require('../logger')

const data = {
  employeeNumber: 19657899,
  firstname: 'John',
  lastname: 'Smith',
  grade: 'AB1',
  birthDate: '1980-01-23',
  joinDate: '2015-05-12',
  salary: 25000,
  email: 'john.smith@gmail.com'
}

const employeeNumber = 19657899

describe('employee-service', function () {
  describe('#get()', function () {
    it('should return a list of Employee objects', function (done) {
      service.getAll().then((employees) => {
        expect(employees).to.not.be.a('null')
        expect(employees).to.be.an('array')
        expect(employees).to.have.length(2)
        done()
      }).catch((err) => done(err))
    })

    it('should return an error if no employees are found', function (done) {
      let original = service.getData()
      service.setData(null)
      service.getAll().then((employees) => {
        done('unexpected employees returned')
      }).catch((err) => {
        expect(err).to.be.equal('NOT_FOUND')
        // restore
        service.setData(original)
        done()
      })
    })
  })

  describe('#get(employeeNumber)', function () {
    it('should return an employee if employee number exists', function (done) {
      let url = config.bonus.url
      let bonus = {
        bonus: 19340.76
      }
      const requestStub = this.sandbox.stub(request, 'post').callsFake(function (config, cb) {
        expect(config.url).to.be.equal(url)
        cb(null, null, bonus)
      })

      service.get(employeeNumber).then((employee) => {
        logger.log('test', JSON.stringify(employee))
        expect(employee).to.not.be.a('null')
        expect(employee).to.be.an('object')
        expect(employee).to.have.any.keys('bonus')
        expect(employee.bonus).to.be.equal(bonus.bonus)
        expect(requestStub).to.be.calledWith()
        done()
      }).catch((err) => done(err))
    })

    it('should return an employee if employee number exists and bonus service disabled', function (done) {
      config.bonus.enabled = false

      service.get(employeeNumber).then((employee) => {
        logger.log('test', JSON.stringify(employee))
        expect(employee).to.not.be.a('null')
        expect(employee).to.be.an('object')
        expect(employee).to.have.any.keys('bonus')
        expect(employee.bonus).to.be.equal(0)
        config.bonus.enabled = true
        done()
      }).catch((err) => done(err))
    })

    it('should return an error if employee number does not exist', function (done) {
      service.get(88888888).then((employee) => {
        done('unexpected employee returned')
      }).catch((err) => {
        expect(err).to.be.equal('NOT_FOUND')
        done()
      })
    })

    it('should return an error if bonus service returns an error', function (done) {
      let url = config.bonus.url
      let msg = 'Bonus service failed'
      const requestStub = this.sandbox.stub(request, 'post').callsFake(function (config, cb) {
        expect(config.url).to.be.equal(url)
        cb(msg, null, null)
      })

      service.get(employeeNumber).then((employee) => {
        done('unexpected employee returned')
      }).catch((err) => {
        expect(requestStub).to.be.calledWith()
        expect(err).to.be.equal(msg)
        done()
      })
    })
  })

  describe('#add()', function () {
    it('should fail to add an invalid employee object', function () {
      let employee = Object.assign({ }, data)
      employee.firstname = null
      let result = service.add(employee)
      return expect(result).to.be.rejectedWith('INVALID')
    })

    it('should fail if no employee storage is found', function () {
      let original = service.getData()
      service.setData(null)
      let employee = Object.assign({ }, data)
      let result = service.add(employee)
      // restore
      service.setData(original)
      return expect(result).to.be.rejectedWith('FAILURE')
    })

    it('should successfully add a valid employee object', function (done) {
      let emp = Object.assign({ }, data)
      emp.employeeNumber = 11111111
      service.add(emp).then((employee) => {
        expect(employee).to.not.be.a('null')
        expect(employee).to.be.an('object')
        expect(employee.valid()).to.be.true
        expect(employee).to.have.any.keys(['employeeNumber'])
        let employeeNumber = employee.employeeNumber
        expect(employeeNumber).to.not.equal(11111111)
        expect(employeeNumber.toString()).to.have.length(8)
        done()
      }).catch((err) => done(err))
    })
  })

  describe('#edit()', function () {
    it('should fail to edit a missing employee object', function () {
      let result = service.edit(10000000, data)
      return expect(result).to.be.rejectedWith('NOT_FOUND')
    })

    it('should fail to edit an invalid employee object', function () {
      let employee = Object.assign({ }, data)
      employee.email = 'testing'
      let result = service.edit(employeeNumber, employee)
      return expect(result).to.be.rejectedWith('INVALID')
    })

    it('should successfully edit a valid employee object', function () {
      let employee = Object.assign({ }, data)
      let email = 'john@yahoo.com'
      // update the email address
      employee.email = email
      let result = service.edit(employeeNumber, employee)
      return Promise.all([
        expect(result).to.eventually.equal('SUCCESS'),
        service.getAll().then((employees) => {
          // validate the email is actually updated
          employee = employees.find(x => x.employeeNumber === employeeNumber)
          expect(employee).to.not.be.a('null')
          expect(employee.email).to.be.equal(email)
        })
      ])
    })
  })

  describe('#del()', function () {
    it('should fail to delete a missing employee object', function () {
      let result = service.del(10000000)
      return expect(result).to.be.rejectedWith('NOT_FOUND')
    })

    it('should successfully delete an existing employee object', function () {
      let result = service.del(employeeNumber)
      return Promise.all([
        expect(result).to.eventually.equal('SUCCESS'),
        service.getAll().then((employees) => {
          // validate the employee got deleted
          let employee = employees.find(x => x.employeeNumber === employeeNumber)
          expect(employee).to.be.an('undefined')
        })
      ])
    })
  })
})
