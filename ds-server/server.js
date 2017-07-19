//https://stackoverflow.com/questions/36270395/interacting-with-deepstream-io-records-server-side
//https://github.com/deepstreamIO/ds-tutorial-tanks/blob/master/ds-server/start.js

const Deepstream = require('deepstream.io')
const deepstream = new Deepstream()

deepstream.set('host', '127.0.0.1')
deepstream.set('port', 5000)

// deepstream.set( 'tcpHost', '127.0.0.1')
// deepstream.set( 'tcpPort', 5001)

deepstream.start()
