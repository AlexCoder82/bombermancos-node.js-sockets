
//Actualiza la lista de espera
function printWaitingPlayersList(waitingPlayersName) {

    document.getElementById("names-list").value = "";
    waitingPlayersName.forEach(name => {
        document.getElementById("names-list").value += name + "\n";
    });

}

//Dibuja el tiempo de partida
function drawPartyTime(time) {

    let minutes = time.minutes;
    let seconds = time.seconds;

    if (minutes.toString().length == 1) {
        minutes = "0" + minutes;
    }
    if (seconds.toString().length == 1) {
        seconds = "0" + seconds;
    }
    document.getElementById("party-time").innerHTML = minutes + ":" + seconds

}

//Dibuja los datos de jugador cuando se juega
function drawPlayerInGameInfo(playersInfo) {

    //Si el cliente es jugador de la partida verá sus datos personales
    playersInfo.forEach(player => {
        if (player.id == playerId && playing == true) {
            document.getElementById("player-in-game-info").style.display = "inherit"
            document.getElementById("player-name").innerHTML = player.name;
            let bombItemAvatar = bombItemIcon;
            bombItemAvatar.style.width = "40px";
            bombItemAvatar.style.height = "40px";
            document.getElementById("bombs-icon").appendChild(bombItemAvatar);
            document.getElementById("bombs").innerHTML = player.bombs;
            let flameItemAvatar = flameItemIcon;
            flameItemAvatar.style.width = "40px";
            flameItemAvatar.style.height = "40px";
            document.getElementById("flame-icon").appendChild(flameItemAvatar);
            document.getElementById("bombRange").innerHTML = player.bombRange;
            let bootsItemAvatar = bootsItemIcon;
            bootsItemAvatar.style.width = "40px";
            bootsItemAvatar.style.height = "40px";
            document.getElementById("boots-icon").appendChild(bootsItemAvatar);
            document.getElementById("speed").innerHTML = player.speed;
            let kickItemAvatar = kickItemIcon;
            kickItemAvatar.style.width = "40px";
            kickItemAvatar.style.height = "40px";
            document.getElementById("kick-icon").appendChild(kickItemAvatar);
            if (player.canKickBombs) {
                document.getElementById("kick").innerHTML = "Sí";
            }
            else {
                document.getElementById("kick").innerHTML = "No";
            }
            let throwItemAvatar = throwItemIcon;
            throwItemAvatar.style.width = "40px";
            throwItemAvatar.style.height = "40px";
            document.getElementById("throw-icon").appendChild(throwItemAvatar);
            if (player.canThrowBomb) {
                document.getElementById("throw").innerHTML = "Sí";
            }
            else {
                document.getElementById("throw").innerHTML = "No";
            }
            switch (player.color) {
                case "WHITE":
                    image = whiteBombermanIcon;
                    break;
                case "BLACK":
                    image = blackBombermanIcon;
                    break;
                case "BLUE":
                    image = blueBombermanIcon;
                    break;
                case "YELLOW":
                    image = yellowBombermanIcon;
                    break;
            }
            image.style.width = "40px";
            image.style.height = "40px";
            document.getElementById("player-avatar").appendChild(image);        
        }
    });
    
}

//Dibuja los nombres de los jugadores cuando se mira una partida sin jugar
function drawPlayersInfo(playersInfo) {

    document.getElementById("players-info").style.display = "inherit"  
    let whiteBombermanAvatar = whiteBombermanIcon;
    whiteBombermanAvatar.style.width = "40px";
    whiteBombermanAvatar.style.height = "40px";
    document.getElementById("player1-avatar").appendChild(whiteBombermanAvatar);
    document.getElementById("player1-name").innerHTML = playersInfo[0].name;
    
    if (playersInfo.length > 1) {
        let blackBombermanAvatar = blackBombermanIcon;
        blackBombermanAvatar.style.width = "40px";
        blackBombermanAvatar.style.height = "40px";
        document.getElementById("player2-avatar").appendChild(blackBombermanAvatar);
        document.getElementById("player2-name").innerHTML = playersInfo[1].name;
    }
    if (playersInfo.length > 2) {
        let blueBombermanAvatar = blueBombermanIcon;
        blueBombermanAvatar.style.width = "40px";
        blueBombermanAvatar.style.height = "40px";
        document.getElementById("player3-avatar").appendChild(blueBombermanAvatar);
        document.getElementById("player3-name").innerHTML = playersInfo[2].name;
    }
    if (playersInfo.length > 3) {
        let yellowBombermanAvatar = yellowBombermanIcon;
        yellowBombermanAvatar.style.width = "40px";
        yellowBombermanAvatar.style.height = "40px";
        document.getElementById("player4-avatar").appendChild(yellowBombermanAvatar);
        document.getElementById("player4-name").innerHTML = playersInfo[3].name;
    }

}

//Dibuja el estado de la partida
function drawPartyState() {

    if (partyIsInProcess) {
        document.getElementById("party-state").innerHTML = "PARTIDA EN CURSO";
    }
    else {
        document.getElementById("party-state").innerHTML = "PARTIDA TERMINADA";
    }

}

//Dibuja el nombre del ganador o el empate 
function drawWinnerName(winner) {

    if (winner) {
        document.getElementById("party-winner").innerHTML = "GANADOR: " + winner.name;
    }
    else {
        document.getElementById("party-winner").innerHTML = "TODO EL MUNDO HA MUERTO"
    }
    
}

//Muestra y oculta el input y el boton para unirse
function showJoinPartyOptions() {

    if (waiting) {
        document.getElementById("join-party-options").style.display = "none";
    }
    else if (!playing) {
        document.getElementById("join-party-options").style.display = "inherit";
    }

}

//Borra los datos de jugador 
function deletePlayerInGameInfo() {

    document.getElementById("player-in-game-info").style.display = "none";

}

//Borra los nombres de los jugadores
function deletePlayersInfo() {

    document.getElementById("players-info").style.display = "none";

}

//Borra el nombre del ganador
function deleteWinnerName() {

    document.getElementById("party-winner").innerHTML = "";

}


