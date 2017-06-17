const app = require('express')()
const bodyparser = require('body-parser')
// const proxy = require('http-proxy-middleware')

// const proxyConfig = require('./proxyConfig')
const reqHandler = require('./reqHandler')
const port = process.env.PORT || '9000'


//https://github.com/chimurai/http-proxy-middleware
// const apiProxy = proxy(proxyConfig)
// app.use('/', apiProxy)

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

app.use(errorHandler)

function errorHandler(err, req, res, next){
  throw new Error('Something went wrong!, err:' + err)
  res.status(500).send('Something went wrong!')
}



// start server
const server = app.listen(port, () => {
  const host = server.address().address
  const port = server.address().port

  console.log('[INFO] listening at http://%s:%s', host, port)
})


// handle sserver requests and route to specified microservices - rudimentary proxy
  //Inspired by: http://www.sascha.tech/2016/02/05/building-a-simple-api-gateway-with-expressjs/
reqHandler(app,server)
