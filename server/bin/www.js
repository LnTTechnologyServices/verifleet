/// <reference path='../typings/tsd.d.ts' />
"use strict";
/**
 * Module dependencies.
 */
var app = require('../app');
var debugModule = require('debug');
var http = require('http');
var db_1 = require('../common/db');
var debug = debugModule('PCC-Seed:server');
var websocket_1 = require('../api/websocket');
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
db_1.getDB().sequelize.sync().then(function () {
    console.log("Listening on port ", port);
    server.listen(port);
    server.on('request', app);
    server.on('error', onError);
    server.on('listening', onListening);
    websocket_1.initWs(server);
});
/**
  * Import cron tasks to start running
  */
var device_sync_1 = require('../cron/device_sync');
device_sync_1.syncDevices();
device_sync_1.deviceSyncCron.start();
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
        : 'Port ' + port;
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
//# sourceMappingURL=www.js.map