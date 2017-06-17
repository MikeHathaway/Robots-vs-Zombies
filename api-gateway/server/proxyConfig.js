module.exports = {
  target: 'http://localhost:9000', // target host
  ws: true,                         // proxy websockets
  // pathRewrite: {
  //   '^/api/old-path' : '/api/new-path',     // rewrite path
  //   '^/api/remove/path' : '/path'           // remove base path
  // },
  router: {
      // when request.headers.host == 'dev.localhost:3000',
      // override target 'http://www.example.org' to 'http://localhost:8000'
      'http://localhost:9000' : 'http://localhost:8080'
  }
}
