import dotenv from "dotenv";
import express from "express";
import path from "path";
import redis from "redis";

dotenv.config();
const serverPort = process.env.SERVER_PORT;

const app = express();
const client = redis.createClient({
    host: 'redis-service',
    port: Number(process.env.REDIS_PORT)
})


app.set( "views", path.join( __dirname, "views" ) );
app.set( "view engine", "ejs" );

app.get( "/", ( req, res ) => {
    client.get('visits', (err: any, visits) => {
        const currentVisits = Number(visits) + 1;
        client.set('visits', String(currentVisits))

        res.render( "index", { currentVisits });
    })
} );

const server = app.listen(serverPort, () => {
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