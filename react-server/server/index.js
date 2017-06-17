const express = require('express')
const bodyparser = require('body-parser')
const path = require('path')

const app = express()
const port = process.env.PORT || '3000'
const ReactAPI = require('../api')


app.enable('trust proxy');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json())

// ReactAPI(app)

// Serve static assets
// app.use(express.static(path.resolve(__dirname, '..', 'public', 'build')));

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

app.use(errorHandler)


function errorHandler(err, req, res, next){
  throw new Error('Something went wrong!, err:' + err)
  res.status(500).send('Something went wrong!')
}

app.listen(port,() => {
  console.log(`Server listening at port ${port}`)
})
