const path = require('path')
const compress = require('compression')
const cors = require('cors')
const helmet = require('helmet')
const bodyParser = require('body-parser')

/* ********** Feathers ********** */
const feathers = require('feathers')
const configuration = require('feathers-configuration')
const hooks = require('feathers-hooks')
// const rest = require('feathers-rest')
const socketio = require('feathers-socketio')
const reactive = require('feathers-reactive')
// const postgresService = require('feathers-postgres')

const handler = require('feathers-errors/handler')
const notFound = require('feathers-errors/not-found')

//https://github.com/feathersjs/feathers-chat/
  // ^ good example


const middleware = require('./middleware')
const services = require('./services')
const appHooks = require('./app.hooks')

// Instantiate Featers
const app = feathers()

// Load app configuration
app.configure(configuration(path.join(__dirname, '.')));

// Enable Security
app.use(cors())
app.use(helmet())

// Compress message headers
app.use(compress())

// Parse messages
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// app.use('/api', feathers.static(app.get('public')));

// Configure API
app.configure(hooks());
// app.configure(rest())
app.configure(socketio())

// Configure error handler
app.use(notFound());
app.use(handler());

app.configure(services);
app.configure(middleware);
app.hooks(appHooks);


module.exports = app
