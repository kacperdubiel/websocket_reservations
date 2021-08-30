const express = require('express');
const app = express();
const server = require('http').createServer(app);

app.get("/", (
    req,
    res
) => res.send("Hello world!"));

server.listen(3000, () => console.log('Listening on port 3000'));