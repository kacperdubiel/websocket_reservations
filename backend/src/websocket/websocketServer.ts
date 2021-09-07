import { Server } from "socket.io";
import http from "http";
import {getClientPlaces, getPlace, getPlaces, removePlace, setPlace} from "../models/place";
import {ok} from "assert";

export class WSServer {
    private io: Server;

    constructor(server: http.Server) {
        this.io = new Server(server);
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.io.on('connection', socket => {
            console.log("New client connected!");

            socket.on('joinRoom', roomData => {
                const roomName = this.getRoomName(roomData)
                socket.join(roomName);
            });

            socket.on('takePlace', (placeId, clientId, roomData, callback) => {
                setPlace(roomData.eventId, roomData.sectorId, placeId, clientId)
                    .then(() => {
                        callback({ status: "ok" });

                        const roomName = this.getRoomName(roomData)
                        socket.broadcast.to(roomName).emit('placeTaken', placeId);
                        // this.io.to(roomName).emit('placeTaken', placeId);
                    })
                    .catch(error => {
                        callback({ status: "error", message: error.message });
                    });

            });

            socket.on('leavePlace', (placeId, clientId, roomData, callback) => {
                getPlace(roomData.eventId, roomData.sectorId, placeId)
                    .then((foundClientId) => {
                        if (foundClientId === clientId){
                            removePlace(roomData.eventId, roomData.sectorId, placeId)
                                .then(() => {
                                    callback({ status: "ok" });

                                    const roomName = this.getRoomName(roomData)
                                    socket.broadcast.to(roomName).emit('placeLeft', placeId);
                                    // this.io.to(roomName).emit('placeTaken', placeId);
                                })
                                .catch(error => {
                                    callback({ status: "error", message: error.message });
                                });
                        } else {
                            callback({ status: "error", message: "It is not your place!" });
                        }
                    })
                    .catch(error => {
                        callback({ status: "error", message: error.message });
                    });
            });

            socket.on('getTakenPlaces', (roomData, callback) => {
                getPlaces(roomData.eventId, roomData.sectorId, 0, -1)
                    .then((takenPlaces) => {
                        callback({ status: "ok", payload: takenPlaces });
                    })
                    .catch(error => {
                        callback({ status: "error", message: error.message });
                    });
            });

            socket.on('getClientPlaces', (clientId, roomData, callback) => {
                getClientPlaces(roomData.eventId, roomData.sectorId, clientId)
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

    getRoomName(roomData: { eventId: string; sectorId: string; }) {
        return 'event-' + roomData.eventId + ':sector-' + roomData.sectorId
    }
}