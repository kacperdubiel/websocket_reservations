import dotenv from "dotenv";
import express from "express";
import path from "path";
import http from "http";
import { WSServer } from "./websocket/websocketServer";
import * as redisUtils from "./redis/redisUtils";

import { indexRouter } from "./routes/index";
import { eventsRouter } from "./routes/events";
import { placesRouter } from "./routes/places";

dotenv.config();
const serverPort = process.env.SERVER_PORT;

// Express server
const app = express();
const server = http.createServer(app);

// Websocket server
const wsServer = new WSServer(server);

// redisUtils.initializeData();

app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.use(express.json());

// Routes
app.use('/', indexRouter);
app.use('/', eventsRouter);
app.use('/', placesRouter);

app.use('/static', express.static(path.join(__dirname, 'public')));

// Server listen
server.listen(serverPort, () => {
    console.log( `server started at http://localhost:${ serverPort }` );
} );

// Graceful shutdown of server
process.on('SIGINT', () => {
    console.log('\n[server] Shutting down...');
    server.close();
    process.exit();
});

process.on('SIGTERM', () => {
    console.log('\n[server] Shutting down...');
    server.close();
    process.exit();
});

process.on('uncaughtException', (e) => {
    console.log('\n[server] Shutting down...');
    console.log('\n[Error] ' + e);
    server.close();
    process.exit();
});