const feathers = require('feathers')
const bodyParser = require('body-parser')
const path = require('path')
const socketio = require('feathers-socketio')
const postgresService = require('feathers-postgres')

const app = feathers()
  // Enable REST services
  .configure(rest())
  .configure(socketio());

  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }));
  .configure(services)

function services(){}
