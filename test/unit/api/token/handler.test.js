'use strict'

const Test = require('tapes')(require('tape'))
const Sinon = require('sinon')
const P = require('bluebird')
const Handler = require('../../../../src/api/token/handler')
const TokenService = require('../../../../src/domain/token')

Test('token handler', handlerTest => {
  let sandbox

  handlerTest.beforeEach(test => {
    sandbox = Sinon.sandbox.create()
    sandbox.stub(TokenService)
    test.end()
  })

  handlerTest.afterEach(test => {
    sandbox.restore()
    test.end()
  })

  handlerTest.test('create should', createTest => {
    createTest.test('create token from auth credentials', test => {
      const token = { token: 'token' }
      const dfsp = { dfspId: 1 }
      TokenService.create.withArgs(dfsp).returns(P.resolve(token))

      const request = {
        auth: {
          credentials: dfsp
        }
      }

      const reply = (response) => {
        test.equal(response, token)
        test.end()
      }

      Handler.create(request, reply)
    })

    createTest.test('reply with error if thrown', test => {
      const error = new Error()
      TokenService.create.returns(P.reject(error))

      const reply = (response) => {
        test.equal(response, error)
        test.end()
      }

      Handler.create({ auth: { credentials: {} } }, reply)
    })

    createTest.end()
  })

  handlerTest.end()
})
