const http = require('http');

const server = http.createServer((req, res) => {
    res.end('Hello World (from Node!)');
});

server.listen(3000);
