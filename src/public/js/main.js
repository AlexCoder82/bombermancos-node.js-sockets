let socket = io();
let ctx = document.getElementById("ctx").getContext("2d");
let playerId;//id de jugador
let playerName;//Nombre del jugador
let playing = false;
let waiting = false;
let partyIsInProcess = false;
let partyUnchangingData;

//Antes de empezar una partida se recibe la informacion
//que no cambia durante la partida
socket.on("partyUnchangingData", (data) => {
    partyUnchangingData = data;
    partyIsInProcess = true;
});

//Se recibe solo cuando se va a jugar
socket.on("gameIsReadyToStart", (seconds) => {
    partyIsInProcess = true;
    waiting = false;
    playing = true;
    drawPartyState();
    deleteWinnerName();
    deletePlayersInfo();
    drawGameStartingCountDown(seconds);
})

//Recibe los nombres de los jugadores en lista de espera
socket.on("waitingPlayers", (waitingPlayersName) => {
    printWaitingPlayersList(waitingPlayersName);
})

//Recibe el id de jugador
socket.on("playerId", (id) => {
    playerId = id;
})

//Recibe el gameOver con el nombre del ganador
socket.on("gameIsOver", (winner) => {
    partyIsInProcess = false;
    playing = false;
    drawPartyState();
    drawWinnerName(winner);
    deletePlayerInGameInfo();
    showJoinPartyOptions();
})

//Recibe las coordenadas de todos los elementos 
//que no son fijos 25 veces por segundo
socket.on("updateView", (data) => {
    let playersData = data.playersData;
    let explosions = data.explosions;
    let items = data.items;
    let breakableWalls = data.breakableWalls;
    let time = data.time;
    let grounds = partyUnchangingData.grounds;
    let bombs = data.bombs;
    let unbreakableWalls;

    if (data.hurryUpTime) {
        unbreakableWalls = data.unbreakableWalls;
    } else {
        unbreakableWalls = partyUnchangingData.unbreakableWalls;
    }
    drawPlayerInGameInfo(playersData);
    drawPartyState();
    if (playing == false && partyIsInProcess) {
        drawPlayersInfo(playersData);
    }
    drawGrounds(grounds);
    drawItems(items);
    drawBreakableWalls(breakableWalls);
    drawExplosions(explosions);
    drawUnbreakableWalls(unbreakableWalls);
    drawPartyTime(time);
    drawBombs(bombs);
    drawPlayersData(playersData);
    drawHurryUpAlert(time);
});

//Eventos al pulsar teclas
document.onkeydown = (event) => {
    if (event.keyCode === 68) {
        socket.emit("directionKeyPress", {
            direction: "right",
            state: true
        });
    }
    else if (event.keyCode === 83) {
        socket.emit("directionKeyPress", {
            direction: "down",
            state: true
        });
    }
    else if (event.keyCode === 65) {
        socket.emit("directionKeyPress", {
            direction: "left",
            state: true
        });
    }
    else if (event.keyCode === 87) {

        socket.emit("directionKeyPress", {
            direction: "up",
            state: true
        });
    }
    else if (event.keyCode === 32) {
       
        socket.emit("bombKeyPress");
    }
    else if (event.keyCode === 69) {

        socket.emit("takeBombKeyPress");
    }
}

//Eventos de teclado al soltar teclas
document.onkeyup = (event) => {
    if (event.keyCode === 68) {
        socket.emit("directionKeyPress", {
            direction: "right",
            state: false
        });
    }
    else if (event.keyCode === 83) {
        socket.emit("directionKeyPress", {
            direction: "down",
            state: false
        });
    }
    else if (event.keyCode === 65) {
        socket.emit("directionKeyPress", {
            direction: "left",
            state: false
        });
    }
    else if (event.keyCode === 87) {
        socket.emit("directionKeyPress", {
            direction: "up",
            state: false
        });
    }
}

//Al pulsar UNIRSE
function joinParty() {

    name = document.getElementById("name").value;
    if (name.length > 0) {
        //Se envia el servidor la peticion para unirse y el nombre de jugador
        socket.emit("joinParty", {
            name: name
        });
        playerName = name;
        waiting = true;
        showJoinPartyOptions();
    }

}






