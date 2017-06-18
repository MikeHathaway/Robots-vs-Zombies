'use strict'

const authentication = require('./authentication')
const messages = require('./messages/messages.service.js')
const users = require('./users/users.service.js')

module.exports = function() {
  const app = this

  app.configure(authentication)
  app.configure(users)
  app.configure(messages)
}
