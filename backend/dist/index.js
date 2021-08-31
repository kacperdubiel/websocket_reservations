"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const redis_1 = __importDefault(require("redis"));
dotenv_1.default.config();
const serverPort = process.env.SERVER_PORT;
const app = (0, express_1.default)();
const client = redis_1.default.createClient({
    host: 'redis-service',
    port: Number(process.env.REDIS_PORT)
});
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.get("/", (req, res) => {
    client.get('visits', (err, visits) => {
        const currentVisits = Number(visits) + 1;
        client.set('visits', String(currentVisits));
        res.render("index", { currentVisits });
    });
});
const server = app.listen(serverPort, () => {
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
//# sourceMappingURL=index.js.map