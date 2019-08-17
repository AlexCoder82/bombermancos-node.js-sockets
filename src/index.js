const express = require('express');
const app = express();
const socketsEvents = require('./sockets.js');

//PAGINA PRINCIPAL
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

//CARPETA PUBLICA
app.use('/public', express.static(__dirname + '/public'));

//PUERTO
const server = app.listen(3000, () => {
    console.log("Servidor ejecutado en el puerto 3000");
});

//SOCKET IO
const socketIO = require('socket.io');
let io = socketIO.listen(server);
socketsEvents.setSockets(io)








