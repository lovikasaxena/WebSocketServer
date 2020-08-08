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
const clientUserNames = []
function getUniqueID() {
    return (Math.random()*10000000000000000).toString(15)
}

function sendMessageToAll(clients, message) {
    for (key in clients) {
        clients[key].sendUTF(message.utf8Data)
    }
    return key;
}

function sendExistingPlayerUserNamesToNewUser(clientUserNames, connection) {
    if(clientUserNames.length < 1) return

    const notification = JSON.stringify({
        type: "allPlayers",
        playerUserNames: clientUserNames,
    })
    console.log('Sending all player notification: ', notification)
    connection.send(notification)
}

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + 'Received a new connection from origin' + request.origin + '.')

    const connection = request.accept(null, request.origin)
    clients[userID] = connection
    console.log('Connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            let utf8Message = JSON.parse(message.utf8Data);
            console.log('Recevied message', utf8Message)

            if (utf8Message.type === 'newPlayer') {
                console.log('Adding new player to clients list: ', utf8Message)
                sendExistingPlayerUserNamesToNewUser(clientUserNames, connection)
                clientUserNames.push(utf8Message.userName)
            }

            sendMessageToAll(clients, message)
        }
    })
})