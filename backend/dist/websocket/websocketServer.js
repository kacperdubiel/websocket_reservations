"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSServer = void 0;
const socket_io_1 = require("socket.io");
const place_1 = require("../models/place");
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
            socket.on('takePlace', (placeId, clientId, roomData, callback) => {
                (0, place_1.setPlace)(roomData.eventId, roomData.sectorId, placeId, clientId)
                    .then(() => {
                    callback({ status: "ok" });
                    const roomName = this.getRoomName(roomData);
                    socket.broadcast.to(roomName).emit('placeTaken', placeId);
                    // this.io.to(roomName).emit('placeTaken', placeId);
                })
                    .catch(error => {
                    callback({ status: "error", message: error.message });
                });
            });
            socket.on('leavePlace', (placeId, clientId, roomData, callback) => {
                (0, place_1.getPlace)(roomData.eventId, roomData.sectorId, placeId)
                    .then((foundClientId) => {
                    if (foundClientId === clientId) {
                        (0, place_1.removePlace)(roomData.eventId, roomData.sectorId, placeId)
                            .then(() => {
                            callback({ status: "ok" });
                            const roomName = this.getRoomName(roomData);
                            socket.broadcast.to(roomName).emit('placeLeft', placeId);
                            // this.io.to(roomName).emit('placeTaken', placeId);
                        })
                            .catch(error => {
                            callback({ status: "error", message: error.message });
                        });
                    }
                    else {
                        callback({ status: "error", message: "It is not your place!" });
                    }
                })
                    .catch(error => {
                    callback({ status: "error", message: error.message });
                });
            });
            socket.on('getTakenPlaces', (roomData, callback) => {
                (0, place_1.getPlaces)(roomData.eventId, roomData.sectorId, 0, -1)
                    .then((takenPlaces) => {
                    callback({ status: "ok", payload: takenPlaces });
                })
                    .catch(error => {
                    callback({ status: "error", message: error.message });
                });
            });
            socket.on('getClientPlaces', (clientId, roomData, callback) => {
                (0, place_1.getClientPlaces)(roomData.eventId, roomData.sectorId, clientId)
                    .then((clientPlaces) => {
                    callback({ status: "ok", payload: clientPlaces });
                })
                    .catch(error => {
                    callback({ status: "error", message: error.message });
                });
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