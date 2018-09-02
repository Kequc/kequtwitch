const Server = require('node-static').Server;
const http = require('http');

// config
const file = new Server('./docs');

// serve
http.createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);
