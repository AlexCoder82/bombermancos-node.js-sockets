let Element = require('./element.js')
let Explosion = require('./explosion.js')
let Flame = require('./flame.js')
let MobileElement = require('./mobileElement.js')
let GameElements = require('./gameElements.js')

const DIRECTION = {
    NONE: "NONE",
    UP: "UP",
    DOWN: "DOWN",
    LEFT: "LEFT",
    RIGHT: "RIGHT"
}

const STATE = {
    NONE: "NONE",
    KICKED: "KICKED",
    THROWN: "THROWN",
    CARRIED: "CARRIED"
}

class Bomb extends MobileElement {

    constructor(range, ownerId) {
        super();
        this.position;
        this.range = range;
        this.time = 100;
        this.direction = DIRECTION.NONE;
        this.state = STATE.NONE;
        this.speed = 10;
        this.ownerId = ownerId;
        this.carrierId;
        this.carrierXPos;
        this.carrierYPos;
        this.throwingEndPosition;
        this.throwingUpEffect = 0;
        //Si en la posicion donde se suelta la bomba hay jugadores
        //los jugadores deben poder salir de la zona pero no volver
        //Se guarda los jugadores en el array mientras no hayan salido
        //de la zona.
        this.playersOn = [];
        this.setCoordinates(ownerId);
        this.setPosition();
        this.setPlayersOn();
    }

    static get DIRECTION() {
        return DIRECTION;
    }

    static get STATE() {
        return STATE;
    }

    //Establece las coordenadas de la bomba segun las coordenadas
    //del jugador que la suelta o bien que la lanza
    setCoordinates(id) {

        let owner = GameElements.players
            .find(player => player.id === id);
        this.setXPos(owner.xPos);
        this.setYPos(owner.yPos);

    }

    //Establece la posicion segun las coordenadas
    setPosition() {

        this.position = GameElements.getPosition(this.xPos, this.yPos);

    }

    //La bomba debe colocarse siempre en una casilla 
    setXPos(ownerXpos) {

        let xPos;
        //Busco las coordenadas x de la casilla a la izquierda de 
        //donde se encuentra el jugador, esta siempre sera un multiple de 50.
        //Si esta mas cerca de la casilla a su derecha entonce sumo 50 para que
        //la bomba se ponga en esa casilla
        let found = false;
        let distance = - 1;
        for (let x = ownerXpos; x > 0 && found == false; x--) {
            if (x % 50 == 0) {
                found = true;
                xPos = x;
            }
            distance++;
        }
        if (distance >= 30) {
            xPos += 50;
        }
        this.xPos = xPos;

    }

    //La bomba debe colocarse siempre en una casilla 
    setYPos(ownerYpos) {

        let yPos;
        //Busco la posicion x de la casilla donde se encuentra el jugador
        //Siempre sera un multiple de 50
        let found = false;
        let distance = -1;
        for (let y = ownerYpos; y > 0 && found == false; y--) {
            if (y % 50 == 0) {
                found = true;
                yPos = y;
            }
            distance++;
        }
        if (distance >= 30) {
            yPos += 50;
        }
        this.yPos = yPos;

    }

    //Si una bomba en movimiento toca un jugador, lo deja mareado
    stunPlayer(player) {

        player.isStunt = true;

    }

    //Comprueba si una bomba en movimiento es obstaculizada por
    //algun jugador , en tal caso lo deja mareado
    isInsideAnyPlayerPosition(xPos, yPos) {

        let insidePlayerPosition = false;
        GameElements.players.forEach(player => {
            if (this.isInsideElement(xPos, yPos, player)) {
                insidePlayerPosition = true;
                this.stunPlayer(player);//Si choca contra un jugador
            }
        })
        return insidePlayerPosition;

    }

    //Comprueba si una bomba en movimiento es obstaculizada por
    //alguna otra bomba
    isBlockedByAnyBomb(nextXPos, nextYPos) {

        for (let i = 0; i < GameElements.bombs.length; i++) {
            if (this != GameElements.bombs[i]) {
                if (this.isInsideElement(nextYPos, nextXPos, GameElements.bombs[i])) {
                    return true;
                }
            }
        }
        return false;

    }


    //Desplaza la bomba segun su direccion y la velocidad
    updatePositionWhenKicked(distance) {

        if (this.direction == "UP") {
            if (this.canMoveUp(distance)) {
                this.yPos -= distance;
                this.xPos;
                if (this.hasANewPosition(this.position - 15)) {
                    this.position -= 15;
                }
            } else {
                this.direction = DIRECTION.NONE;
                this.state = STATE.NONE;
            }
        }

        if (this.direction == "DOWN") {
            if (this.canMoveDown(distance)) {
                this.yPos += distance;
                this.xPos;
                if (this.hasANewPosition(this.position + 15)) {
                    this.position += 15;
                }
            }
            else {
                this.direction = DIRECTION.NONE;
                this.state = STATE.NONE;
            }
        }

        if (this.direction == "LEFT") {
            if (this.canMoveLeft(distance)) {
                this.yPos;
                this.xPos -= distance;
                if (this.hasANewPosition(this.position - 1)) {
                    this.position -= 1;
                }
            }
            else {
                this.direction = DIRECTION.NONE;
                this.state = STATE.NONE;
            }
        }

        if (this.direction == "RIGHT") {
            if (this.canMoveRight(distance)) {
                this.yPos;
                this.xPos += distance;
                if (this.hasANewPosition(this.position + 1)) {
                    this.position += 1;
                }
            } else {
                this.direction = DIRECTION.NONE;
                this.state = STATE.NONE;
            }
        }

        //Una bomba lanzada se mueve de 10pixels en 10 pixels, 
        //cabe la posibilidad de que se encuentre a 5 pixels
        // de un jugador y se quede bloqueada , en tal caso podra hacer
        // un movimiento de 5 pixels para pegarse al jugador
        if (distance == 10 && this.direction == DIRECTION.NONE) {
            //vuelvo a llamar el metodo pero con una distancia de 5 pixels
            this.updatePositionWhenKicked(5);
        }

    }

    //Actualiza la posicion y las coordenadas cuando la bomba esta sujetada
    //por un juegador
    updatePositionWhenCarried() {

        let carrier = GameElements.players.find(player =>
            player.id === this.carrierId);
        this.carrierXPos = carrier.xPos;
        this.carrierYPos = carrier.yPos;
        this.setCoordinates(this.carrierId);
        this.setPosition();

    }

    //Actualiza la posicion y las coordenadas cuando es lanzada
    updatePositionWhenThrown() {

        this.throwingUpEffect += 5;
        //Retraso la cuenta atras para que no explote antes de llegar
        //a destino
        if (this.time == 1) {
            this.time = 2;
        }
        switch (this.direction) {
            case "UP":
                if (this.yPos == 0) {
                    this.yPos = 650;
                }
                this.yPos -= 5;
                if (GameElements.elementsPosition
                    .get(this.throwingEndPosition).type == Element
                        .TYPE.UNBREAKABLE_WALL
                    || GameElements.elementsPosition
                        .get(this.throwingEndPosition).type == Element
                            .TYPE.BREAKABLE_WALL) {
                    if (this.throwingEndPosition < 15) {
                        this.throwingEndPosition += 165;
                    }
                    else {
                        this.throwingEndPosition -= 15;
                    }
                }
                break;
            case "DOWN":
                if (this.yPos == 600) {
                    this.yPos = 0;
                }
                this.yPos += 5;
                if (GameElements.elementsPosition
                    .get(this.throwingEndPosition).type == Element
                        .TYPE.UNBREAKABLE_WALL
                    || GameElements.elementsPosition
                        .get(this.throwingEndPosition).type == Element
                            .TYPE.BREAKABLE_WALL) {
                    if (this.throwingEndPosition > 166) {
                        this.throwingEndPosition -= 165;
                    }
                    else {
                        this.throwingEndPosition += 15;
                    }
                }
                break;
            case "LEFT":
                if (this.xPos == 0) {
                    this.xPos = 755;
                }
                this.xPos -= 5;
                if (GameElements.elementsPosition
                    .get(this.throwingEndPosition).type == Element
                        .TYPE.UNBREAKABLE_WALL
                    || GameElements.elementsPosition
                        .get(this.throwingEndPosition).type == Element
                            .TYPE.BREAKABLE_WALL) {
                    if ((this.throwingEndPosition - 1) % 15 == 0) {
                        this.throwingEndPosition += 14;
                    }
                    else {
                        this.throwingEndPosition -= 1;
                    }
                }
                break;
            case "RIGHT":
                if (this.xPos == 700) {
                    this.xPos = 0;
                }
                this.xPos += 5;
                if (GameElements.elementsPosition
                    .get(this.throwingEndPosition).type == Element
                        .TYPE.UNBREAKABLE_WALL
                    || GameElements.elementsPosition
                        .get(this.throwingEndPosition).type == Element
                            .TYPE.BREAKABLE_WALL) {
                    if ((this.throwingEndPosition) % 15 == 0) {
                        this.throwingEndPosition -= 14;
                    }
                    else {
                        this.throwingEndPosition += 1;
                    }
                }
                break;
        }

        let element = GameElements.elementsPosition.get(this.throwingEndPosition);
        //La bomba se para cuando llega a la posicion de llegada
        if (this.xPos == element.xPos && this.yPos == element.yPos) {
            //Compruebo si hay un jugador para que lo deje mareado
            this.isInsideAnyPlayerPosition(this.xPos, this.yPos);
            //Si hay un jugador en esa posicion, debe poder atravesarlo
            this.setPlayersOn();
            this.direction = DIRECTION.NONE;
            this.state = STATE.NONE;
            this.throwingUpEffect = 0;
        }

    }

    //añade al array los jugadores que se encuentran en la zona de la bomba
    setPlayersOn() {

        GameElements.players.forEach(player => {
            if (player.isInsideElement(player.xPos, player.yPos, this)) {
                this.playersOn.push(player.id);
            }
        });

    }

    //Comprueba si el jugador sigue en la posicion de la bomba 
    playerIsStillOn(player) {

        let playerIsOn = false;
        if (player.isInsideElement(player.xPos, player.yPos, this)) {
            playerIsOn = true;
        }
        return playerIsOn;

    }

    //Comprueba si un jugador por su id ya ha salido de la zona de la bomba 
    playerHasLeft(id) {

        let playerHasLeft = false;
        let index = this.playersOn.indexOf(id);
        if (index == -1) {
            playerHasLeft = true;
        }
        return playerHasLeft;

    }

    //Si un jugador ha salido de la posicion de la bomba, se borra del array
    setPlayerOut(id) {

        let index = this.playersOn.indexOf(id);
        if (index != -1) {
            this.playersOn.splice(index, 1);
        }

    }

    //La bomba explota
    explodes() {

        let flames = [];
        let hasLeftFlame = true;
        let hasRightFlame = true;
        let hasUpFlame = true;
        let hasDownFlame = true;
        let leftWallHasBeenBroke = false;
        let rightWallHasBeenBroke = false;
        let upWallHasBeenBroke = false;
        let downWallHasBeenBroke = false;
        let wallsToBreakPosition = [];

        //El rango de la explosion va del minimo 50 hasta this.range
        for (let i = 50; i <= this.range; i += 50) {

            //SI hay paredes fijas las llamas se paran 

            //llama izquierda
            if (hasLeftFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos - i, this.yPos);
                let element = GameElements.elementsPosition.get(flamePositionNumber);

                if (element.type == Element.TYPE.UNBREAKABLE_WALL) {
                    hasLeftFlame = false;
                }
                //La pared de abajo  tambien para la llama
                else if (element.type == Element.TYPE.GROUND) {

                    if (this.yPos > element.yPos && GameElements.elementsPosition.get(flamePositionNumber + 15).type == "UNBREAKABLE WALL") {
                        hasLeftFlame = false;

                    }
                }
            }

            //lama derecha
            if (hasRightFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos + i, this.yPos);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.UNBREAKABLE_WALL) {
                    hasRightFlame = false;
                }//La pared de abajo  tambien para la llama
                else if (element.type == Element.TYPE.GROUND) {
                    if (this.yPos > element.yPos && GameElements.elementsPosition.get(flamePositionNumber + 15).type == "UNBREAKABLE WALL") {
                        hasRightFlame = false;
                    }
                }
            }

            //Llama arriba
            if (hasUpFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos, this.yPos - i);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.UNBREAKABLE_WALL) {
                    hasUpFlame = false;
                }//La pared de la derecha  tambien para la llama
                else if (element.type == Element.TYPE.GROUND) {
                    if (this.xPos > element.xPos && GameElements.elementsPosition.get(flamePositionNumber + 1).type == "UNBREAKABLE WALL") {
                        hasUpFlame = false;
                    }
                }
            }
            //Llama abajo
            if (hasDownFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos, this.yPos + i);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.UNBREAKABLE_WALL) {
                    hasDownFlame = false;
                }//La pared de la derecha  tambien para la llama
                else if (element.type == Element.TYPE.GROUND) {
                    if (this.xPos > element.xPos && GameElements.elementsPosition.get(flamePositionNumber + 1).type == "UNBREAKABLE WALL") {
                        hasDownFlame = false;
                    }
                }
            }

            //Si no se paran, se comprueba si hay paredes que se rompen

            //Llama izquierda
            if (hasLeftFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos - i, this.yPos);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.BREAKABLE_WALL) {
                    let leftFlame = new Flame(this.xPos - i,
                        this.yPos, Flame.AXIS.HORIZONTAL);
                    flames.push(leftFlame);
                    wallsToBreakPosition.push(flamePositionNumber);
                    leftWallHasBeenBroke = true;
                    hasLeftFlame = false;
                }
            }

            //Llama derecha
            if (hasRightFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos + i, this.yPos);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.BREAKABLE_WALL) {
                    let leftFlame = new Flame(this.xPos + i,
                        this.yPos, Flame.AXIS.HORIZONTAL);
                    flames.push(leftFlame);
                    wallsToBreakPosition.push(flamePositionNumber);
                    rightWallHasBeenBroke = true;
                    hasRightFlame = false;
                }
            }

            //Llama arriba
            if (hasUpFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos, this.yPos - i);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.BREAKABLE_WALL) {
                    let leftFlame = new Flame(this.xPos,
                        this.yPos - i, Flame.AXIS.VERTICAL);
                    flames.push(leftFlame);
                    wallsToBreakPosition.push(flamePositionNumber);
                    upWallHasBeenBroke = true;
                    hasUpFlame = false;
                }
            }

            //Llama abajo
            if (hasDownFlame) {
                let flamePositionNumber = GameElements.getPosition(this.xPos, this.yPos + i);
                let element = GameElements.elementsPosition.get(flamePositionNumber);
                if (element.type == Element.TYPE.BREAKABLE_WALL) {
                    let leftFlame = new Flame(this.xPos,
                        this.yPos + i, Flame.AXIS.VERTICAL);
                    flames.push(leftFlame);
                    wallsToBreakPosition.push(flamePositionNumber)
                    downWallHasBeenBroke = true;
                    hasDownFlame = false;
                }
            }

            //Si las llamas no han sido frenadas ni paradas, 
            //se crea nuevas llamas
            if (!leftWallHasBeenBroke && hasLeftFlame) {
                let leftFlame = new Flame(this.xPos - i,
                    this.yPos, Flame.AXIS.HORIZONTAL);
                flames.push(leftFlame);
            }
            if (!rightWallHasBeenBroke && hasRightFlame) {
                let rightFlame = new Flame(this.xPos + i,
                    this.yPos, Flame.AXIS.HORIZONTAL);
                flames.push(rightFlame);
            }
            if (!upWallHasBeenBroke && hasUpFlame) {
                let upFlame = new Flame(this.xPos,
                    this.yPos - i, Flame.AXIS.VERTICAL);
                flames.push(upFlame);
            }
            if (!downWallHasBeenBroke && hasDownFlame) {
                let downFlame = new Flame(this.xPos,
                    this.yPos + i, Flame.AXIS.VERTICAL);
                flames.push(downFlame);
            }
        }
        //Se crea la explosion con un array de llamas 
        //y un array de paredes a destruir
        let explosion = new Explosion(this.xPos, this.yPos, flames, wallsToBreakPosition);
        GameElements.explosions.push(explosion);

    }

}

module.exports = Bomb;