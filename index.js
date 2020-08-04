const webSocketServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');

const server = http.createServer();
server.listen(webSocketServerPort);
console.log('listening at port 8000');

const wsServer = new webSocketServer({
    httpServer: server
})

const clients = {}

wsServer.on('request', function(request) {
    var userID = getUniqueID();
    console.log((new Date()) + 'Received a new connection from origin' + request.origin + '.')

    const connection  = request.accept(null, request.origin)
    clients[userID] = connection;
    console.log('Connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function(message) {
        if(message.type === 'utf8') {
            console.log('Recevied message', message.utf8Data)
            for(key in clients) {
                clients[key].sentUTF(message.utf8Data)
                console.log('Sent message to', client[key])
            }
        }
    })
})