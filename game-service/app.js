const feathers = require('feathers')
const path = require('path')
const configuration = require('feathers-configuration')
const port = process.env.PORT || 3000

const app = feathers()

app.configure(configuration(path.join(__dirname, '.')));
app.use('/', feathers.static(app.get('public')));

const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
);
