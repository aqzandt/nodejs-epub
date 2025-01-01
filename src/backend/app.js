const http = require('http');
const httpHandler = require("./routeHandler.js");

const server = http.createServer(httpHandler);

server.listen(3000, () => {
    console.log('Server is listening on localhost:3000');
});