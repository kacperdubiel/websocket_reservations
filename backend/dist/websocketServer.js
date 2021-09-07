"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
const socket_io_1 = require("socket.io");
class WSServer {
    constructor(server) {
        this.io = new socket_io_1.Server(server);
        this.initializeEventListeners();
    }
    initializeEventListeners() {
        this.io.on('connection', socket => {
            console.log("New client connected!");
            socket.on('joinRoom', roomData => {
                const roomName = this.getRoomName(roomData);
                socket.join(roomName);
            });
            socket.on('message', (msg, roomData) => {
                const roomName = this.getRoomName(roomData);
                this.io.to(roomName).emit('message', msg);
            });
            socket.on('disconnect', () => {
                console.log('Client disconnected.');
            });
        });
    }
    getRoomName(roomData) {
        return 'event-' + roomData.eventId + ':sector-' + roomData.sectorId;
    }
}
exports.WSServer = WSServer;
//# sourceMappingURL=websocketServer.js.map