'use strict';

const messages = require('./messages')
const authentication = require('./authentication')
const users = require('./users')

module.exports = function() {
  const app = this

  // app.configure(authentication)
  app.configure(user)
  app.configure(messages)
}
