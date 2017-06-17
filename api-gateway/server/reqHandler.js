
const request = require('request')
const mappings = [].concat(require('../routes.json'))


module.exports = (app,server) => {

  function appMethod(host, port, path, method){
    return app.all(path, (req, res) => {
        console.log("[INFO] API request on %s:%s%s send to %s:%s%s", server.address().address, server.address().port, req.originalUrl, host, port, req.originalUrl)
        let rreq = null

        if(host.indexOf("http://") <= -1 && host.indexOf("https://") <= -1){
            host = "http://"+host
        }

        const url = host + ":" + port + req.originalUrl

        if(method.toUpperCase() === "POST" || method.toUpperCase() == "PUT"){
            rreq = request.post({uri: url, json: req.body})
        }
        else {
            rreq = request(url)
        }

        req.pipe(rreq).pipe(res)
    })
  }

  // stores the registered routes
  const storedRoutes = []


  // registers a route for each request
    //instantiated by api call to gateway
    //need to have service server running to function
  function registerRoutes(mappings){
    return mappings.map(route => {
      return route.redirects.forEach(redirect => {
        const method = redirect.method === undefined ? "GET" : redirect.method
        storedRoutes.push(appMethod(route.host, route.port, redirect.path, method))
        console.log("[INIT] Created route to %s %s:%s%s ", method.toUpperCase(), route.host, route.port, redirect.path)
      })
    })
  }

  registerRoutes(mappings)

}
