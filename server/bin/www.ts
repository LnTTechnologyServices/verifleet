
/// <reference path='../typings/tsd.d.ts' />

/**
 * Module dependencies.
 */

import app = require('../app');
import debugModule = require('debug');
import http = require('http');

import {getDB} from '../common/db';

var debug = debugModule('PCC-Seed:server');

import {initWs} from '../api/websocket';

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer();


/**
 * Listen on provided port, on all network interfaces.
 */
getDB().sequelize.sync().then(function() {
  console.log("Listening on port ", port);
  server.listen(port);
  server.on('request', app);
  server.on('error', onError);
  server.on('listening', onListening);
  initWs(server);
})


/**
  * Import cron tasks to start running
  */

import {deviceSyncCron, syncDevices} from '../cron/device_sync';
syncDevices();
deviceSyncCron.start()


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
