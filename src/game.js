const Item = require('./model/item');
const Element = require('./model/element')
const GameElements = require('./model/gameElements.js')
const Player = require('./model/player.js')
const Bomb = require('./model/bomb.js')

let REQUIRED_PLAYERS = 4;

class Game {

    constructor() {
        this.winner;
        this.time = { minutes: 2, seconds: 0 };
        this.playersData = [];
        this.playersStartArea = [];//Zonas de inicio de los juegadores
        this.addBombItems = 15;
        this.addRangeItems = 15;
        this.bootsItems = 2;
        this.kickBombItems = 2;
        this.throwBombItems = 2;
        this.callsCounter = 0;
        this.hurryUpStartTime = 2250;
        this.hurryUpTime = false;
        this.hurryUpWallXPos = 0;
        this.hurryUpWallYPos = 50;
    }

    static get REQUIRED_PLAYERS() {
        return REQUIRED_PLAYERS;
    }

    static createWaitingPlayer(id, name) {
        return new Player(id, name)
    }

    //Inicia la partida
    startParty() {

        this.generateGame();

    }

    //Genera todos los elementos 
    generateGame() {

        this.generateGrounds();
        this.setPlayers();
        this.setPlayerStartArea();
        this.generateUnbreakableWalls();
        this.generateBreakableWalls();
        this.generateItems();
        GameElements.bombs.splice(0,GameElements.bombs.length);
        GameElements.explosions.splice(0,GameElements.explosions.length);
        
    }

    //Establece las posiciones, coordenadas y colores de cada jugador
    setPlayers() {

        GameElements.players[0].xPos = 50;
        GameElements.players[0].yPos = 50;
        GameElements.players[0].position = 17;
        GameElements.players[0].state = Player.STATES.PLAYING;
        GameElements.players[0].color = Player.COLORS.WHITE;

        if (REQUIRED_PLAYERS > 1) {
            GameElements.players[1].xPos = 650;
            GameElements.players[1].yPos = 50;
            GameElements.players[1].position = 29;
            GameElements.players[1].state = Player.STATES.PLAYING;
            GameElements.players[1].color = Player.COLORS.BLACK;
        }
        if (REQUIRED_PLAYERS > 2) {
            GameElements.players[2].xPos = 50;
            GameElements.players[2].yPos = 550;
            GameElements.players[2].position = 167;
            GameElements.players[2].state = Player.STATES.PLAYING;
            GameElements.players[2].color = Player.COLORS.BLUE;
        }
        if (REQUIRED_PLAYERS > 3) {
            GameElements.players[3].xPos = 650;
            GameElements.players[3].yPos = 550;
            GameElements.players[3].position = 179;
            GameElements.players[3].state = Player.STATES.PLAYING;
            GameElements.players[3].color = Player.COLORS.YELLOW;
        }

    }

    //Genara el suelo, hay sueldo debajo de cualquier elemento
    generateGrounds() {

        GameElements.grounds.slice(0, GameElements.grounds.length);//Reinciia el array

        let xPos = 0;
        let yPos = 0;
        let position = 1;
        for (let i = 1; i <= 195; i++) {
            let element = new Element(xPos, yPos, Element.TYPE.GROUND);
            GameElements.grounds.push(element);
            GameElements.elementsPosition.set(position, element);
            position++;
            xPos += 50;
            if (xPos == 750) {
                xPos = 0;
                yPos += 50;
            }
        }

    }

    //Genera las paredes fijas
    generateUnbreakableWalls() {

        //Reincia el array
        GameElements.unbreakableWalls.splice(0, GameElements.unbreakableWalls.length);
        //PAREDES EXTERNAS
        let xPos = 0;
        let yPos = 0;
        for (let i = 1; i <= 52; i++) {
            if (yPos == 0 || yPos == 600) {
                let position = GameElements.getPosition(xPos, yPos);
                let wall = new Element(xPos, yPos,
                    Element.TYPE.UNBREAKABLE_WALL);
                GameElements.unbreakableWalls.push(wall);
                GameElements.elementsPosition.set(position, wall);
            }
            else {
                if (xPos == 0) {
                    let position = GameElements.getPosition(xPos, yPos);
                    let wall = new Element(xPos, yPos,
                        Element.TYPE.UNBREAKABLE_WALL);
                    GameElements.unbreakableWalls.push(wall);
                    GameElements.elementsPosition.set(position, wall);
                    xPos = 700;
                    position = GameElements.getPosition(xPos, yPos);
                    wall = new Element(xPos, yPos,
                        Element.TYPE.UNBREAKABLE_WALL);
                    GameElements.unbreakableWalls.push(wall);
                    GameElements.elementsPosition.set(position, wall);
                    i++;
                }
            }
            xPos += 50;
            if (xPos == 750) {
                xPos = 0;
                yPos += 50;
            }
        }

        //PAREDES INTERIORES 
        xPos = 100;
        yPos = 100;
        for (let i = 53; i <= 82; i++) {

            let wall = new Element(xPos, yPos,
                Element.TYPE.UNBREAKABLE_WALL);
            GameElements.unbreakableWalls.push(wall);
            let positionNumber = GameElements.getPosition(xPos, yPos);
            GameElements.elementsPosition.set(positionNumber, wall);
            xPos += 100;
            if (xPos == 700) {
                xPos = 100;
                yPos += 100;
            }
        }

    }

    //Genera las paredes que se rompen
    generateBreakableWalls() {

        //Reincia el array
        GameElements.breakableWalls.slice(0, GameElements.breakableWalls.length);
        //LLeno el array de muros con todos las coordenadas disponibles 
        //salvo las coordenadas de las zonas de incio de cada jugador
        let x = 50;
        let y = 50;
        for (let i = 1; i <= 111; i++) {
            //Si no son coordenadas de la zona de inicio 
            if (!this.isAPlayerStartZone(x, y)) {
                let wall = new Element(x, y, Element.TYPE.BREAKABLE_WALL);
                GameElements.breakableWalls.push(wall);
                let position = GameElements.getPosition(x, y);
                GameElements.elementsPosition.set(position, wall);
            }
            //Lineas inpares
            if (y % 100 == 0) {
                x += 100;
            }
            //lineas pares
            else {
                x += 50;
            }
            //cambio de linea
            if (x >= 700) {
                x = 50;
                y += 50;
            }
        }
        //Retiro 40 paredes de maneras aleatoria
        for (let i = 0; i < 40; i++) {
            let index = Math.floor(Math.random() * GameElements.breakableWalls.length);
            let element = GameElements.breakableWalls[index];
            let position = GameElements.getPosition(element.xPos, element.yPos);
            GameElements.elementsPosition.set(position, new Element(element.xPos, element.yPos, Element.TYPE.GROUND))
            GameElements.breakableWalls.splice(index, 1);
        }

    }

    //genera objetos con las coordenadas de paredes de manera aleatoria
    generateItems() {

        GameElements.items.splice(0, GameElements.items.length);//Reincia el array
        let indexes = []; //guarda los indices ya elegidos para no repetir
        let maxIndex = GameElements.breakableWalls.length - 1;
        let index;

        //Se crea los items que añaden una bomba
        for (let i = 0; i < this.addBombItems; i++) {
            //Mientras el indice generado exista en el array de indices
            //Vuelve a generar indice
            do {
                index = Math.floor(Math.random() * maxIndex);
            } while (indexes.includes(index));

            indexes.push(index);
            //Recupero la pared que corresponde al indice
            let wall = GameElements.breakableWalls[index];
            //El item tiene las coordenadas de esa pared
            let item = new Item(wall.xPos, wall.yPos, Item.TYPE.ADD_BOMB);
            GameElements.items.push(item);
        }

        //Se crea los items para correr mas rapido
        for (let i = 0; i < this.bootsItems; i++) {
            //Mientras el indice generado exista en el array de indices
            do {
                index = Math.floor(Math.random() * maxIndex);
            } while (indexes.includes(index));

            indexes.push(index);
            let wall = GameElements.breakableWalls[index];
            let item = new Item(wall.xPos, wall.yPos, Item.TYPE.BOOTS);
            GameElements.items.push(item);
        }

        //Se crea los items que aumentan el rango de las explosiones
        for (let i = 0; i < this.addRangeItems; i++) {

            //Mientras el indice generado exista en el array de indices
            do {
                index = Math.floor(Math.random() * maxIndex);
            } while (indexes.includes(index));

            indexes.push(index);
            let wall = GameElements.breakableWalls[index];
            let item = new Item(wall.xPos, wall.yPos, Item.TYPE.ADD_RANGE);
            GameElements.items.push(item);
        }

        //Se crea los items para empujar bombas
        for (let i = 0; i < this.kickBombItems; i++) {
            do {
                index = Math.floor(Math.random() * maxIndex);
            } while (indexes.includes(index));

            indexes.push(index);
            let wall = GameElements.breakableWalls[index];
            let item = new Item(wall.xPos, wall.yPos, Item.TYPE.KICK_BOMBS);
            GameElements.items.push(item);
        }
        //Se crea los items para coger y lanzar bombas
        for (let i = 0; i < this.throwBombItems; i++) {
            do {
                index = Math.floor(Math.random() * maxIndex);
            } while (indexes.includes(index));

            indexes.push(index);
            let wall = GameElements.breakableWalls[index];
            let item = new Item(wall.xPos, wall.yPos, Item.TYPE.THROW_BOMBS);
            GameElements.items.push(item);
        }

    }

    //Establece el array de coordenadas de las zonas de inicio 
    //de cada jugador donde no se puede crear ningun muro
    setPlayerStartArea() {

        let element = new Element(50, 50);
        this.playersStartArea.push(element);
        element = new Element(50, 100);
        this.playersStartArea.push(element);
        element = new Element(100, 50);
        this.playersStartArea.push(element);
        element = new Element(600, 50);
        this.playersStartArea.push(element);
        element = new Element(650, 50);
        this.playersStartArea.push(element);
        element = new Element(650, 100);
        this.playersStartArea.push(element);
        element = new Element(50, 500);
        this.playersStartArea.push(element);
        element = new Element(50, 550);
        this.playersStartArea.push(element);
        element = new Element(100, 550);
        this.playersStartArea.push(element);
        element = new Element(600, 550);
        this.playersStartArea.push(element);
        element = new Element(650, 550);
        this.playersStartArea.push(element);
        element = new Element(650, 500);
        this.playersStartArea.push(element);

    }

    //Retorna verdadero si las coordenadas pertenecen 
    //a una de las zonas de inicio
    isAPlayerStartZone(x, y) {

        for (let i = 0; i < this.playersStartArea.length; i++) {
            if (x == this.playersStartArea[i].xPos
                && y == this.playersStartArea[i].yPos) {
                return true;
            }
        }
        return false;

    }

    //Establece las coordenadas de las paredes cuando se activa el hurryUp
    hurryUp() {

        if (this.hurryUpWallXPos >= 250 && this.hurryUpWallXPos <= 300 && this.hurryUpWallYPos == 300) {
            this.hurryUpWallXPos += 50;
        }
        if (this.hurryUpWallXPos == 250 && this.hurryUpWallYPos == 350) {
            this.hurryUpWallYPos -= 50;
        }
        if (this.hurryUpWallXPos >= 300 && this.hurryUpWallXPos <= 450 && this.hurryUpWallYPos == 350) {
            this.hurryUpWallXPos -= 50;
        }
        if (this.hurryUpWallXPos == 450 && this.hurryUpWallYPos >= 250 && this.hurryUpWallYPos <= 300) {
            this.hurryUpWallYPos += 50;
        }
        if (this.hurryUpWallXPos >= 200 && this.hurryUpWallXPos <= 400 && this.hurryUpWallYPos == 250) {
            this.hurryUpWallXPos += 50;
        }
        if (this.hurryUpWallXPos == 200 && this.hurryUpWallYPos >= 300 && this.hurryUpWallYPos <= 400) {
            this.hurryUpWallYPos -= 50;
        }
        if (this.hurryUpWallXPos >= 250 && this.hurryUpWallXPos <= 500 && this.hurryUpWallYPos == 400) {
            this.hurryUpWallXPos -= 50;
        }
        if (this.hurryUpWallXPos == 500 && this.hurryUpWallYPos >= 200 && this.hurryUpWallYPos <= 350) {
            this.hurryUpWallYPos += 50;
        }
        if (this.hurryUpWallXPos >= 150 && this.hurryUpWallXPos <= 450 && this.hurryUpWallYPos == 200) {
            this.hurryUpWallXPos += 50;
        }
        if (this.hurryUpWallXPos == 150 && this.hurryUpWallYPos >= 250 && this.hurryUpWallYPos <= 450) {
            this.hurryUpWallYPos -= 50;
        }
        if (this.hurryUpWallXPos >= 200 && this.hurryUpWallXPos <= 550 && this.hurryUpWallYPos == 450) {
            this.hurryUpWallXPos -= 50;
        }
        if (this.hurryUpWallXPos == 550 && this.hurryUpWallYPos >= 150 && this.hurryUpWallYPos <= 400) {
            this.hurryUpWallYPos += 50;
        }
        if (this.hurryUpWallXPos >= 100 && this.hurryUpWallXPos <= 500 && this.hurryUpWallYPos == 150) {
            this.hurryUpWallXPos += 50;
        }
        if (this.hurryUpWallYPos >= 150 && this.hurryUpWallYPos <= 500 && this.hurryUpWallXPos == 100) {
            this.hurryUpWallYPos -= 50;
        }
        if (this.hurryUpWallYPos == 500 && this.hurryUpWallXPos <= 600 && this.hurryUpWallXPos >= 100) {
            this.hurryUpWallXPos -= 50;
        }
        if (this.hurryUpWallYPos >= 100 && this.hurryUpWallYPos <= 450 && this.hurryUpWallXPos == 600) {
            this.hurryUpWallYPos += 50;
        }
        if (this.hurryUpWallYPos == 100 && this.hurryUpWallXPos >= 50 && this.hurryUpWallXPos <= 550) {
            this.hurryUpWallXPos += 50;
        }
        if (this.hurryUpWallXPos == 50 && this.hurryUpWallYPos <= 550 && this.hurryUpWallYPos >= 150) {
            this.hurryUpWallYPos -= 50;
        }
        if (this.hurryUpWallXPos >= 100 && this.hurryUpWallYPos == 550) {
            this.hurryUpWallXPos -= 50;
        }
        if (this.hurryUpWallXPos == 650) {
            this.hurryUpWallYPos += 50;
        }
        if (this.hurryUpWallXPos >= 0 && this.hurryUpWallXPos <= 600 && this.hurryUpWallYPos == 50) {
            this.hurryUpWallXPos += 50;
        }
        let wall = new Element(this.hurryUpWallXPos,
            this.hurryUpWallYPos, Element.TYPE.UNBREAKABLE_WALL);
        GameElements.unbreakableWalls.push(wall);
        let position = GameElements.getPosition(wall.xPos, wall.yPos);
        GameElements.elementsPosition.set(position, wall);

        //Si donde se crea una pared hay un jugador, este muere
        GameElements.players.forEach(player => {
            if (!player.isDead) {
                //Comprueba si el jugador esta dentro de un elemento 
                if (player.isInsideElement(player.xPos, player.yPos, wall) == true) {
                    player.isDead = true;
                }
            }

        });

        //Si donde se crea una pared, hay una bomba esta desaparece
        GameElements.bombs.forEach(bomb => {
            if (position == GameElements.getPosition(bomb.xPos, bomb.yPos)) {
                let index = GameElements.bombs.indexOf(bomb);
                GameElements.bombs.splice(index, 1);
            }
        });

    }

    //Comprueba si la partida esta acabada
    isGameOver() {

        let gameIsOver = false;
        let playersAliveCounter = 0;
        let lastPlayerAlive;

        //Cuenta los jugadores vivos
        GameElements.players.forEach(player => {
            if (!player.isDead) {
                playersAliveCounter++;
                lastPlayerAlive = player;
            }
        });

        //Si solo queda un jugador vivo , es el ganador
        if (playersAliveCounter == 1) {
            gameIsOver = true;
            this.winner = {
                id: lastPlayerAlive.id,
                name: lastPlayerAlive.name
            }
        }
        //Si los jugadores mueren todos al mismo tiempo, no hay ganador
        if (playersAliveCounter == 0) {
            gameIsOver = true;
            this.winner = null;
        }
        //Si se acaba el tiempo, lo cual no puede pasar porque las paredes 
        //matarian antes de llegar el tiempo a 0
        if (this.time.minutes == 0 && this.time.seconds == 0) {
            gameIsOver = true;
        }
        return gameIsOver;

    }

    //Datos que no cambian durante la partida o gran parte de ella
    getPartyUnchangingData() {

        let data = {
            unbreakableWalls: GameElements.unbreakableWalls,
            grounds: GameElements.grounds,
        };
        return data;

    }

    //Funcion llamada 25 veces por segundo, junta todos los datos
    //que cambian durante una partida
    getPartyChangingData() {

        this.updateRemainingTime();
        this.updatePlayersData();
        this.updateBombsData();
        this.updateExplosionsData();
        let data = {
            time: this.time,
            hurryUpTime: this.hurryUpTime,
            playersData: this.playersData,
            bombs: GameElements.bombs,
            explosions: GameElements.explosions,
            breakableWalls: GameElements.breakableWalls,
            items: GameElements.items
        }
        //Si el hurryUp esta activo, agrego los muros 
        if (this.hurryUpTime) {
            data.unbreakableWalls = GameElements.unbreakableWalls;
        }
        return data;

    }

    //actualiza las bombas en juego 
    updateBombsData() {

        GameElements.bombs.forEach(bomb => {
            if (bomb.state == Bomb.STATE.KICKED) {
                bomb.updatePositionWhenKicked(bomb.speed);
            }
            if (bomb.state == Bomb.STATE.CARRIED) {
                bomb.updatePositionWhenCarried();
            }
            if (bomb.state == Bomb.STATE.THROWN) {
                bomb.updatePositionWhenThrown();
            }
            //Comprueba si algun jugador que estuviera dentro de la posicion
            //de la bomba en el momento de crearse ha salido de la posicion
            //para impedirlo volver a entrar.
            GameElements.players.forEach(p => {
                if (!bomb.playerIsStillOn(p)) {
                    bomb.setPlayerOut(p.id);
                }
            });

            bomb.time -= 1;//Cuenta atras para explotar

            if (bomb.time <= 0) {
                bomb.explodes();
                //El jugador que dejo la bomba, recupera una bomba
                let playerId = bomb.ownerId;
                let player = GameElements.players.find(player =>
                    player.id === playerId);
                player.recoverBomb();
                //La bomba desaparece
                let index = GameElements.bombs.indexOf(bomb);
                GameElements.bombs.splice(index, 1);
            }
        });

    }

    //Actualiza todas las explosiones en juego
    updateExplosionsData() {

        GameElements.explosions.forEach(explosion => {
            //La explosion solo daña en el momento 
            if (explosion.time == 10) {
                explosion.killsPlayers();
                explosion.breaksItems();
                explosion.breaksWalls();
                explosion.makesBombsExplode();
            }
            explosion.time -= 1;
            //Las explosiones desaparecen
            if (explosion.time == 0) {
                let index = GameElements.explosions.indexOf(explosion);
                GameElements.explosions.splice(index, 1);
            }
        });

    }

    //actualiza toda la informacion de los jugadores en juego
    updatePlayersData() {

        this.playersData = [];// Reinicia el array

        GameElements.players.forEach(player => {
            if (!player.isDead) {
                if (player.isStunt) {
                    player.stunningTime--;
                    if (player.stunningTime == 0) {
                        player.isStunt = false;
                    }
                }
                //Si el juegador no esta mareado puede ...
                else {
                    if (player.canKickBomb) {
                        player.kickBomb();
                    }
                    player.updatePosition(player.speed);
                    player.pickItem();
                }
            }
            //Si el jugador esta muerto, se hace la animacion de la muerte
            else {
                if (player.deathAnimationTime > 0) {
                    player.deathAnimation();
                    player.deathAnimationTime--;
                }

            }
            //Se agrega al array la informacion de cada jugador 
            let playerData = this.getUpdatedPlayerData(player);
            this.playersData.push(playerData);
        });
    }

    //Informacion de cada jugador
    getUpdatedPlayerData(player) {

        let playerData = {
            id: player.id,
            name: player.name,
            isDead: player.isDead,
            deathAnimationTime: player.deathAnimationTime,
            isStunt: player.isStunt,
            color: player.color,
            bombs: player.bombs,
            canKickBombs: player.canKickBomb,
            canThrowBomb: player.canThrowBomb,
            bombRange: player.bombRange / 50,
            speed: player.speed / 5,
            xPos: player.xPos,
            yPos: player.yPos

        }
        return playerData;

    }

    //Actualiza el tiempo de juego
    updateRemainingTime() {

        this.callsCounter++;
        //cada 25 llamadas, quito un segundo
        if (this.callsCounter % 25 == 0) {
            if (this.time.seconds == 0) {
                this.time.minutes -= 1;
                this.time.seconds = 60;
            }
            this.time.seconds -= 1;
        }
        //Se activa el hurryUp
        if (this.callsCounter == this.hurryUpStartTime) {
            this.hurryUpTime = true;
        }
        //Se llama al metodo cada 5 llamadas 
        if (this.callsCounter >= this.hurryUpStartTime
            && this.callsCounter % 5 == 0) {
            this.hurryUp();
        }

    }
    
}
module.exports = Game;