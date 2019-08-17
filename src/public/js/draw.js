let deathsEffect = [0, 0, 0, 0];//Un contador de efecto por jugador

//Dibuja las paredes fijas
function drawUnbreakableWalls(unbreakableWalls) {

    unbreakableWalls.forEach(wall => {
        ctx.drawImage(wallIcon, wall.xPos, wall.yPos);
    });

}

//Dibuja el suelo
function drawGrounds(grounds) {

    grounds.forEach(ground => {
        ctx.drawImage(groundIcon, ground.xPos, ground.yPos);
    });

}

//Dibuja las bombas
function drawBombs(bombs) {

    bombs.forEach(bomb => {
        if (bomb.state == "CARRIED") {
            ctx.drawImage(bombIcon, bomb.carrierXPos, bomb.carrierYPos - 30, 50, 50);
        } else if (bomb.state == "THROWN") {
            if (bomb.direction == "LEFT" || bomb.direction == "RIGHT") {
                if (bomb.throwingUpEffect <= 50) {
                    let width = 50 + bomb.throwingUpEffect / 2;
                    ctx.drawImage(bombIcon, bomb.xPos,
                        bomb.yPos - bomb.throwingUpEffect, width, width);
                } else if (bomb.throwingUpEffect <= 100) {
                    let width = 100 - bomb.throwingUpEffect / 2;

                    ctx.drawImage(bombIcon, bomb.xPos,
                        bomb.yPos - (100 - bomb.throwingUpEffect), width, width);
                } else {
                    ctx.drawImage(bombIcon, bomb.xPos,
                        bomb.yPos, 50, 50);
                }
            } else {
                if (bomb.throwingUpEffect <= 50) {
                    let width = 50 + bomb.throwingUpEffect / 2;
                    ctx.drawImage(bombIcon, bomb.xPos,
                        bomb.yPos, width, width);
                } else if (bomb.throwingUpEffect <= 100) {
                    let width = 100 - bomb.throwingUpEffect / 2;
                    ctx.drawImage(bombIcon, bomb.xPos,
                        bomb.yPos, width, width);
                }
                else {
                    ctx.drawImage(bombIcon, bomb.xPos,
                        bomb.yPos, 50, 50);
                }
            }
        }

        else {
            ctx.drawImage(bombIcon, bomb.xPos, bomb.yPos, 50, 50);
        }
    });

}

//Dibuja los jugadores
function drawPlayersData(playersData) {

    playersData.forEach(player => {

        if (!player.isDead) {

            switch (player.color) {
                case "WHITE":
                    if (player.isStunt)
                        ctx.drawImage(stuntWhiteBombermanIcon,
                            player.xPos, player.yPos + 10, 60, 50);
                    else
                        ctx.drawImage(whiteBombermanIcon,
                            player.xPos, player.yPos - 10, 50, 60);
                    break;
                case "BLACK":
                    if (player.isStunt)
                        ctx.drawImage(stuntBlackBombermanIcon,
                            player.xPos, player.yPos + 10, 60, 50);
                    else
                        ctx.drawImage(blackBombermanIcon,
                            player.xPos, player.yPos - 10, 50, 60);
                    break;
                case "BLUE":
                    if (player.isStunt)
                        ctx.drawImage(stuntBlueBombermanIcon,
                            player.xPos, player.yPos + 10, 60, 50);
                    else
                        ctx.drawImage(blueBombermanIcon,
                            player.xPos, player.yPos - 10, 50, 60);
                    break;
                case "YELLOW":
                    if (player.isStunt)
                        ctx.drawImage(stuntYellowBombermanIcon,
                            player.xPos, player.yPos + 10, 60, 50);
                    else
                        ctx.drawImage(yellowBombermanIcon,
                            player.xPos, player.yPos - 10, 50, 60);
                    break;
            }

        }
        else if (player.isDead && player.deathAnimationTime > 0) {
            drawDeathAnimation(player);
        }
        if (player.deathAnimationTime == 0) {
            switch (player.color) {
                case "WHITE":
                    deathsEffect[0] = 0;
                    break;
                case "BLACK":
                    deathsEffect[1] = 0;
                    break;
                case "BLUE":
                    deathsEffect[2] = 0;
                    break;
                case "YELLOW":
                    deathsEffect[3] = 0;
                    break;
            }
        }
    });

}

//Dibuja la animacion de la muerte de un personaje
function drawDeathAnimation(player) {

    switch (player.color) {
        case "WHITE":
            deathsEffect[0] += 50;
            ctx.drawImage(whiteBombermanIcon, player.xPos,
                player.yPos - 10, 40 + deathsEffect[0], 50 + deathsEffect[0]);
            break;
        case "BLACK":

            deathsEffect[1] += 50;
            ctx.drawImage(blackBombermanIcon, player.xPos,
                player.yPos - 10, 40 + deathsEffect[1], 50 + deathsEffect[1]);
            break;
        case "BLUE":
            deathsEffect[2] += 50;
            ctx.drawImage(blueBombermanIcon, player.xPos,
                player.yPos - 10, 40 + deathsEffect[2], 50 + deathsEffect[2]);
            break;
        case "YELLOW":
            deathsEffect[3] += 50;
            ctx.drawImage(yellowBombermanIcon, player.xPos,
                player.yPos - 10, 40 + deathsEffect[3], 50 + deathsEffect[3]);
            break;
    }

}

//Dibuja las explosiones de bombas
function drawExplosions(explosions) {

    explosions.forEach(explosion => {
        ctx.drawImage(flameCenterIcon, explosion.xPos, explosion.yPos);
        explosion.flames.forEach(flame => {
            if (flame.axis == "HORIZONTAL") {
                ctx.drawImage(horizontalflameIcon, flame.xPos, flame.yPos);
            }
            if (flame.axis == "VERTICAL") {
                ctx.drawImage(verticalFlameIcon, flame.xPos, flame.yPos);
            }
        });
    });

}

//Dibuja los objetos
function drawItems(items) {

    items.forEach(item => {
        switch (item.type) {
            case "BOOTS":
                ctx.drawImage(bootsItemIcon, item.xPos, item.yPos);
                break;
            case "ADD_BOMB":
                ctx.drawImage(bombItemIcon, item.xPos, item.yPos);
                break;
            case "ADD_RANGE":
                ctx.drawImage(flameItemIcon, item.xPos, item.yPos);
                break;
            case "KICK_BOMBS":
                ctx.drawImage(kickItemIcon, item.xPos, item.yPos);
                break;
            case "THROW_BOMBS":
                ctx.drawImage(throwItemIcon, item.xPos, item.yPos);
                break;
        }
    });

}

//Dibuja las paredes que se rompen
function drawBreakableWalls(breakableWalls) {

    breakableWalls.forEach(wall=>{
        ctx.drawImage(breakableWallIcon, wall.xPos, wall.yPos);
    });   

}

//Muestra la Cuenta atras
function drawGameStartingCountDown(seconds) {

    ctx.font = "300px Arial";
    ctx.fillText(seconds, 300, 425);

}

//Aviso del hurryUp cuando queda 00:35
function drawHurryUpAlert(time) {

    if (time.minutes == 0 && time.seconds == 35) {
        ctx.font = "100px Arial";
        ctx.fillText("HURRY UP !!! ", 60, 350);
    }
}

