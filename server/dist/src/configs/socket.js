"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socket_io_1 = require("socket.io");
var server_1 = require("../server");
function createIoServer() {
    var ioServer = new socket_io_1.Server(server_1.httpServer, {
        cors: {
            credentials: true,
            origin: process.env.ALLOWED_ORIGIN,
        },
        cookie: true,
        transports: ['websocket', 'polling'],
    });
    return ioServer;
}
exports.default = createIoServer;
