/* eslint-env mocha */

import {expect} from 'chai'
const Employee = require('./employee-model')
const service = require('./employee-service')
const server = require('../index')

const data = [new Employee({
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

const employeeNumber = 7373636363

describe('employee-api', function () {
  describe('get-handler', function () {
    it('should return status-code 200 and a list of Employee objects', function (done) {
      let stub = this.sandbox.stub(service, 'getAll').returns(Promise.resolve(data))

      server.inject({
        method: 'GET',
        url: '/employee'
      }).then((response) => {
        expect(response.payload).to.be.equal(JSON.stringify(data))
        expect(response.statusCode).to.equal(200)
        expect(stub).to.have.been.calledOnce
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 404 if no employees are found', function (done) {
      let stub = this.sandbox.stub(service, 'getAll').returns(Promise.reject('NOT_FOUND'))

      server.inject({
        method: 'GET',
        url: '/employee'
      }).then((response) => {
        expect(response.statusCode).to.equal(404)
        expect(stub).to.have.been.calledOnce
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 500 if an error has occurred', function (done) {
      let stub = this.sandbox.stub(service, 'getAll').returns(Promise.reject('FAILURE'))

      server.inject({
        method: 'GET',
        url: '/employee'
      }).then((response) => {
        expect(response.statusCode).to.equal(500)
        expect(stub).to.have.been.calledOnce
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })

  // get by employee number
  describe('getByEmployeeNumber-handler', function () {
    it('should return status-code 200 and an employee for valid employee number', function (done) {
      let stub = this.sandbox.stub(service, 'get').returns(Promise.resolve(data[0]))

      server.inject({
        method: 'GET',
        url: `/employee/${employeeNumber}`
      }).then((response) => {
        expect(response.payload).to.be.equal(JSON.stringify(data[0]))
        expect(response.statusCode).to.equal(200)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(employeeNumber)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 404 if no employee is found', function (done) {
      let stub = this.sandbox.stub(service, 'get').returns(Promise.reject('NOT_FOUND'))

      server.inject({
        method: 'GET',
        url: `/employee/${employeeNumber}`
      }).then((response) => {
        expect(response.statusCode).to.equal(404)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(employeeNumber)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 400 if employee number is invalid', function (done) {
      server.inject({
        method: 'GET',
        url: `/employee/eerrrrrr`
      }).then((response) => {
        expect(response.statusCode).to.equal(400)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 500 if backend throws error', function (done) {
      let stub = this.sandbox.stub(service, 'get').returns(Promise.reject('FATAL'))

      server.inject({
        method: 'GET',
        url: `/employee/${employeeNumber}`
      }).then((response) => {
        expect(response.statusCode).to.equal(500)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(employeeNumber)
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })

  // create employee
  describe('post-handler', function () {
    it('should return status-code 200 and a new employee', function (done) {
      let stub = this.sandbox.stub(service, 'add').returns(Promise.resolve(data[0]))
      let employee = JSON.stringify(data[0])
      server.inject({
        method: 'POST',
        url: `/employee`,
        payload: employee
      }).then((response) => {
        expect(response.payload).to.be.equal(JSON.stringify(data[0]))
        expect(response.statusCode).to.equal(200)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(JSON.parse(employee))
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 400 if the employee is invalid', function (done) {
      let employee = Object.assign({}, data[0])
      employee.email = 'testing'
      server.inject({
        method: 'POST',
        url: `/employee`,
        payload: employee
      }).then((response) => {
        expect(response.statusCode).to.equal(400)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 500 if backend throws error', function (done) {
      let stub = this.sandbox.stub(service, 'add').rejects('FATAL')
      let employee = JSON.stringify(data[0])
      server.inject({
        method: 'POST',
        url: `/employee`,
        payload: employee
      }).then((response) => {
        expect(response.statusCode).to.equal(500)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(JSON.parse(employee))
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })

  // edit employee
  describe('put-handler', function () {
    it('should return status-code 200 and no content', function (done) {
      let stub = this.sandbox.stub(service, 'edit').returns(Promise.resolve('SUCCESS'))
      let employee = JSON.stringify(data[0])
      server.inject({
        method: 'PUT',
        url: `/employee/${employeeNumber}`,
        payload: employee
      }).then((response) => {
        expect(response.payload).to.be.equal('')
        expect(response.statusCode).to.equal(204)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(employeeNumber, JSON.parse(employee))
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 400 if the employee is invalid', function (done) {
      let employee = Object.assign({}, data[0])
      employee.email = 'testing'
      server.inject({
        method: 'PUT',
        url: `/employee/${employeeNumber}`,
        payload: employee
      }).then((response) => {
        expect(response.statusCode).to.equal(400)
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 404 if no employee is found', function (done) {
      let stub = this.sandbox.stub(service, 'edit').callsFake(function (num, empl) {
        return Promise.reject('NOT_FOUND')
      })
      let employee = JSON.stringify(data[0])
      server.inject({
        method: 'PUT',
        url: `/employee/${employeeNumber}`,
        payload: employee
      }).then((response) => {
        expect(response.statusCode).to.equal(404)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(employeeNumber, JSON.parse(employee))
        done()
      }).catch((err) => {
        done(err)
      })
    })

    it('should return status-code 500 if backend throws error', function (done) {
      let stub = this.sandbox.stub(service, 'edit').callsFake(function (num, empl) {
        return Promise.reject('FATAL')
      })
      let employee = JSON.stringify(data[0])
      server.inject({
        method: 'PUT',
        url: `/employee/${employeeNumber}`,
        payload: employee
      }).then((response) => {
        expect(response.statusCode).to.equal(500)
        expect(stub).to.have.been.calledOnce
        expect(stub).to.have.been.calledWithExactly(employeeNumber, JSON.parse(employee))
        done()
      }).catch((err) => {
        done(err)
      })
    })
  })
})
