const Game = require('./game');
const GameElements = require('./model/gameElements.js')

let sockets = [];//Lista de todos los sockets abiertos
let waitingPlayers = [];
let partyIsInProcess = false;
let game;

exports.setSockets = (io) => {

    //Contador de sockets , se usa como id para cada socket 
    //y cada jugador asociado a ese socket
    let socketsCounter = 0;

    //Al abrirse un cliente
    io.on('connection', (socket) => {

        socketsCounter++;
        saveSocket(socket, socketsCounter);
        emitWaitingPlayersName();
        if (partyIsInProcess) {
            emitPartyUnchangingData();
        }

        //Cuando un jugador se une
        socket.on("joinParty", (data) => {
            let player = Game.createWaitingPlayer(socket.id, data.name);
            emitPlayerId(socket, player.id);
            waitingPlayers.push(player);
            emitWaitingPlayersName();//refresco la lista en los clientes
            //Cuando la lista de espera alcanza la cantidad de jugadores
            //requeridos se lanza la partida
            if (partyCanStart()) {
                startParty();
            }
        });

        //Evento al pulsar teclas de movimientos
        socket.on('directionKeyPress', (data) => {
            if (partyIsInProcess) {
                let player = GameElements.players
                    .find(player => player.id === socket.id);
                if (player != null && !player.isDead)
                    player.setPressingDirection(data.direction, data.state);
            }
        });

        //Evento al pulsar tecla de bomba
        socket.on('bombKeyPress', () => {
            if (partyIsInProcess) {
                let player = GameElements.players.find(player => player.id === socket.id);
                if (player != null && player.bombs > 0 && !player.isDead) {
                    player.dropBomb();
                }
            }
        });

        //Evento al pulsar tecla para coger bomba y lanzar bomba;
        socket.on('takeBombKeyPress', () => {
            if (partyIsInProcess) {
                let player = GameElements.players.find(player =>
                    player.id === socket.id);
                if (player != null && player.canThrowBomb
                    && player.carriedBomb == null && !player.isDead) {
                    player.takeBomb();
                }
                else if (player != null && player.canThrowBomb
                    && player.carriedBomb != null && !player.isDead) {
                    player.throwBomb();
                }
            }
        });

        //Al desconectarse un cliente
        socket.on('disconnect', () => {
            removeWaitingPlayer(socket.id);// se retira de la lista de espera
            //Si se desconecta un jugador en una partida, se le mata
            if (partyIsInProcess) {
                killDisconnectedPlayer(socket.id);
            }
            removeSocket(socket.id);// se retira de la lista de clientes
        });

    });

}

//Envia la informacion que no cambia durante una partida
function emitPartyUnchangingData() {

    let partyUnchangingData = game.getPartyUnchangingData();
    sockets.forEach(socket => {
        socket.emit("partyUnchangingData", partyUnchangingData);
    });

}

// Comprueba si la partida puede arrancar
function partyCanStart() {

    let partyCanStart = false;
    if (!partyIsInProcess
        && waitingPlayers.length == Game.REQUIRED_PLAYERS) {
        partyCanStart = true;
    }
    return partyCanStart;

}

//Mata a un jugador en caso de que se deseconecte en plena partida
function killDisconnectedPlayer(id) {

    let player = GameElements.players
        .find(player => player.id === id);
    if (player != null)
        player.isDead = true;

}

//agrega cada nuevo socket abierto al array de sockets
function saveSocket(socket, socketsCounter) {

    socket.id = socketsCounter;//Asigna un id a cada socket abierto
    sockets.push(socket);

}

//Retira un jugador de la lista de espera
function removeWaitingPlayer(id) {

    let found = false;
    let index;
    for (let i = 0; i < waitingPlayers.length && found == false; i++) {
        if (id == waitingPlayers[i].id) {
            index = i;
            found = true;
        }
    }
    if (found) {
        waitingPlayers.splice(index, 1);
    }
    emitWaitingPlayersName();//Refresco la lista en los clientes

}

//Retira un socket de la lista de sockets
function removeSocket(id) {

    let found = false;
    let index;
    for (let i = 0; i < sockets.length && found == false; i++) {
        if (sockets[i].id == id) {
            index = i;
            found = true;
        }
    }
    sockets.splice(index, 1);

}

//Empieza una partida
function startParty() {

    //Reinicia el array estatico de jugadores
    GameElements.players.splice(0, GameElements.players.length);

    //Agrega los primeros jugadores de la lista de espera
    //a la lista de jugadores para la partida
    for (let i = 0; i < Game.REQUIRED_PLAYERS; i++) {
        GameElements.players.push(waitingPlayers[i]);
    }
    //Retiro los jugadores de la lista de espera
    for (let i = 0; i < Game.REQUIRED_PLAYERS; i++) {
        waitingPlayers.splice(0, 1)
    }
    game = new Game();
    game.startParty();
    emitWaitingPlayersName();//Refresco
    emitGameIsReadyToStart();//Aviso

}

//Aviso de partida
function emitGameIsReadyToStart() {

    let seconds = 5;
    let countdown = setInterval(() => {
        if (seconds > 0) {
            //Se envia a todos los clientes los datos de la partida generada
            sockets.forEach(socket => {
                emitPartyUnchangingData();
                let data = game.getPartyChangingData();
                socket.emit("updateView", data);

                //Se envia a los  jugadores la cuenta atras
                GameElements.players.forEach(player => {
                    if (socket.id == player.id) {
                        socket.emit("gameIsReadyToStart", seconds);
                    }
                });
            });
        }
        seconds--;
        //A los 5 segundos empieza la partida
        if (seconds == -1) {
            clearInterval(countdown);
            partyIsInProcess = true;
        }
    }, 1000);

}

//Envia el id de jugador a un cliente
function emitPlayerId(socket, playerId) {

    socket.emit("playerId", playerId);

}

//Envia la lista de espera con los nombres de jugadores a todos los clientes
function emitWaitingPlayersName() {

    let waitingPlayersName = [];//Lista de nombres
    waitingPlayers.forEach(player => {
        waitingPlayersName.push(player.name);
    });
    sockets.forEach(socket => {
        socket.emit("waitingPlayers", waitingPlayersName);
    });

}

//Envia el gameOver a todos los clientes con el nombre del ganador
function emitGameIsOver(winner) {

    sockets.forEach(socket => {
        socket.emit("gameIsOver", winner);
    })

    //Pausa de 5 segundos
    let seconds = 5;
    let countdown = setInterval(() => {
        seconds--;
        if (seconds == 0) {
            clearInterval(countdown);
        }
    }, 1000);

}

//Envia 25 veces por segundo la vista actualizada a todos los clientes
setInterval(() => {
    //Mientras la partida no acabe
    if (partyIsInProcess) {
        let data = game.getPartyChangingData();
        sockets.forEach(socket => {
            socket.emit('updateView', data);
        });
        let gameIsOver = game.isGameOver();
        if (gameIsOver == true) {
            let winner = game.winner;
            partyIsInProcess = false;
            emitGameIsOver(winner);
            if (partyCanStart()) {
                startParty();
            }
        }
    }
    
}, 1000 / 25);





