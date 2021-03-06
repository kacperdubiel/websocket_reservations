"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const websocketServer_1 = require("./websocket/websocketServer");
const index_1 = require("./routes/index");
const events_1 = require("./routes/events");
const places_1 = require("./routes/places");
dotenv_1.default.config();
const serverPort = process.env.SERVER_PORT;
// Express server
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Websocket server
const wsServer = new websocketServer_1.WSServer(server);
// redisUtils.initializeData();
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express_1.default.json());
// Routes
app.use('/', index_1.indexRouter);
app.use('/', events_1.eventsRouter);
app.use('/', places_1.placesRouter);
app.use('/static', express_1.default.static(path_1.default.join(__dirname, 'public')));
// Server listen
server.listen(serverPort, () => {
    console.log(`server started at http://localhost:${serverPort}`);
});
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
//# sourceMappingURL=server.js.map