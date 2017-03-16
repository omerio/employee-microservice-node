/* eslint-env mocha */

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const chaiAsPromised = require('chai-as-promised')
const logger = require('../logger')
const config = require('../config')
require('sinon-as-promised') // http://clarkdave.net/2016/09/node-v6-6-and-asynchronously-handled-promise-rejections/

config.bonus.enabled = true

chai.use(chaiAsPromised)

before(function () {
  chai.use(sinonChai)

  // we want to have logger.test() without flooding the console with other levels' messages
  /* logger.setLevels({
    debug: 5,
    info: 4,
    warning: 3,
    error: 2,
    critical: 1,
    test: 0
  }) */

  logger.transports.console.level = 'test'
})

beforeEach(function () {
  this.sandbox = sinon.sandbox.create()
})

afterEach(function () {
  this.sandbox.restore()
})
