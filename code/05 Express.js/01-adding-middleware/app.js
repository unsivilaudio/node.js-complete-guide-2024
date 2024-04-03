const http = require('http');

const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('In the middleware!');
    next(); // Allow the request to continue to the next middleware in  line
});

app.use((req, res, next) => {
    console.log('In another middleware!');
    // ...
});

const server = http.createServer(app);

server.listen(3000);
