let GameElements = require('./gameElements.js')
let MobileElement = require('./mobileElement.js')
let Bomb = require('./bomb')

const COLORS = {
  WHITE: "WHITE",
  BLACK: "BLACK",
  BLUE: "BLUE",
  YELLOW: "YELLOW"
}

const STATES = {
  WAITING: "WAITING",
  PLAYING: "PLAYING"
}

class Player extends MobileElement {

  constructor(id, name) {
    super();
    this.id = id;
    this.color;
    this.state;
    this.isStunt = false;
    this.stunningTime = 25;
    this.name = name;
    this.bombs = 5;
    this.bombRange = 50;
    this.speed = 5;
    this.canKickBomb = false;
    this.canThrowBomb = true;
    this.carriedBomb;
    this.isDead = false;
    this.deathAnimationTime = 25;
    this.pressingLeft = false;
    this.pressingRight = false;
    this.pressingUp = false;
    this.pressingDown = false;
    this.inventory = [];
  }
  
  static get COLORS() {
    return COLORS;
  }
  static get STATES() {
    return STATES;
  }

  //Cuando un jugador muere se alteran sus coordenadas para crear 
  //una animacion en el cliente
  deathAnimation() {

    if (this.yPos < 300) {
      this.yPos += 15;
    }
    if (this.yPos > 300) {
      this.yPos -= 15;
    }
    if (this.xPos < 200) {
      this.xPos += 15;
    }
    if (this.xPos > 200) {
      this.xPos -= 50;
    }

  }

  //Al pulsar para lanzar una bomba, se establece la posicion 
  //donde va a aterrizar la bomba segun la direccion y la posicion actual
  throwBomb() {

    let bombPosition = this.carriedBomb.position;

    if (this.pressingUp && !this.pressingDown && !this.pressingLeft && !this.pressingRight) {
      this.carriedBomb.throwingEndPosition = bombPosition - 30;
      if (GameElements.elementsPosition.get(this.carriedBomb.throwingEndPosition) == null) {
        this.carriedBomb.throwingEndPosition = bombPosition + 165;
      }
      this.carriedBomb.direction = Bomb.DIRECTION.UP
      this.carriedBomb.state = Bomb.STATE.THROWN;
      this.carriedBomb = null;
    }

    if (this.pressingDown && !this.pressingUp && !this.pressingLeft && !this.pressingRight) {
      this.carriedBomb.throwingEndPosition = bombPosition + 30;
      if (GameElements.elementsPosition.get(this.carriedBomb.throwingEndPosition) == null) {
        this.carriedBomb.throwingEndPosition = bombPosition - 165;
      }
      this.carriedBomb.direction = Bomb.DIRECTION.DOWN
      this.carriedBomb.state = Bomb.STATE.THROWN;
      this.carriedBomb = null;
    }

    if (this.pressingLeft && !this.pressingDown && !this.pressingUp && !this.pressingRight) {
      this.carriedBomb.throwingEndPosition = bombPosition - 2;
      if (this.carriedBomb.throwingEndPosition % 15 == 0) {
        this.carriedBomb.throwingEndPosition = bombPosition + 13;
      }
      this.carriedBomb.direction = Bomb.DIRECTION.LEFT
      this.carriedBomb.state = Bomb.STATE.THROWN;
      this.carriedBomb = null;
    }

    if (this.pressingRight && !this.pressingDown && !this.pressingLeft && !this.pressingUp) {
      this.carriedBomb.throwingEndPosition = bombPosition + 2;
      if ((this.carriedBomb.throwingEndPosition - 1) % 15 == 0) {
        this.carriedBomb.throwingEndPosition = bombPosition - 13;
      }
      this.carriedBomb.direction = Bomb.DIRECTION.RIGHT
      this.carriedBomb.state = Bomb.STATE.THROWN;
      this.carriedBomb = null;
    }

  }

  //Devuelve todas las bombas cercanas al jugador
  getNearBombs() {

    let nearBombs = [];
    GameElements.bombs.forEach(bomb => {
      if (this.xPos >= bomb.xPos - 50
        && this.xPos <= bomb.xPos + 50
        && this.yPos >= bomb.yPos - 50
        && this.yPos <= bomb.yPos + 50) {
        nearBombs.push(bomb)
      }
    });
    return nearBombs;

  }

  //Devuelve la bomba mas cercana al jugador
  getNearestBomb() {

    let nearBombs = this.getNearBombs();

    let nearestBomb = nearBombs[0];
    for (let i = 0; i < nearBombs.length - 1; i++) {
      if (
        Math.sqrt(Math.pow(nearBombs[i].xPos - this.xPos)
          + Math.pow(nearBombs[i].yPos - this.yPos))
        < Math.sqrt(Math.pow(nearBombs[i + 1].xPos - this.xPos)
          + Math.pow(nearBombs[i + 1].yPos - this.yPos))) {
        nearestBomb = nearBombs[i];
      }
      else {
        nearestBomb = nearBombs[i + 1];
      }
    }
    return nearestBomb;

  }

  //Al pulsar para coger una bomba
  takeBomb() {

    let bomb = this.getNearestBomb();
    if (bomb != null) {
      bomb.state = Bomb.STATE.CARRIED;
      bomb.carrierId = this.id;
      this.carriedBomb = bomb;
    }

  }

  //Al empujar una bomba
  kickBomb() {

    if (this.pressingUp) {
      this.upKickBomb();
    }
    if (this.pressingDown) {
      this.downKickBomb();
    }
    if (this.pressingLeft) {
      this.leftKickBomb();
    }
    if (this.pressingRight) {
      this.rightKickBomb();
    }

  }

  //Empuja la bomba para arriba
  upKickBomb() {

    GameElements.bombs.forEach(bomb => {
      if (this.xPos >= bomb.xPos
        && this.xPos + 50 <= bomb.xPos + 50
        && this.yPos == bomb.yPos + 50) {
        bomb.direction = Bomb.DIRECTION.UP;
        bomb.state = Bomb.STATE.KICKED;
      }
    });

  }

  //Empuja la bomba para abajo
  downKickBomb() {

    GameElements.bombs.forEach(bomb => {
      if (this.xPos >= bomb.xPos
        && this.xPos + 50 <= bomb.xPos + 50
        && this.yPos == bomb.yPos - 50) {
        bomb.direction = Bomb.DIRECTION.DOWN;
        bomb.state = Bomb.STATE.KICKED;
      }
    });

  }

  //Empuja la bomba para la izquierda
  leftKickBomb() {

    GameElements.bombs.forEach(bomb => {
      if (this.xPos == bomb.xPos + 50
        && this.yPos >= bomb.yPos
        && this.yPos + 50 <= bomb.yPos + 50) {
        bomb.direction = Bomb.DIRECTION.LEFT;
        bomb.state = Bomb.STATE.KICKED;
      }
    });

  }

  //Empuja la bomba para la derecha
  rightKickBomb() {

    GameElements.bombs.forEach(bomb => {
      if (this.xPos == bomb.xPos - 50
        && this.yPos >= bomb.yPos
        && this.yPos + 50 <= bomb.yPos + 50) {
        bomb.direction = Bomb.DIRECTION.RIGHT;
        bomb.state = Bomb.STATE.KICKED;
      }
    });

  }

  //Actualiza la posicion y las coordenadas del jugador
  updatePosition(distance) {

    let canNotMove = false;

    if (this.pressingUp && this.pressingLeft) {
      if (this.canMoveUp(distance)) {
        this.yPos -= distance;
        if (this.hasANewPosition(this.position - 15)) {
          this.position -= 15;
        }
        if (this.canMoveLeft(distance)) {
          this.xPos -= distance;
          if (this.hasANewPosition(this.position - 1)) {
            this.position -= 1;
          }
        }
      }
      else {
        if (this.canMoveLeft(distance)) {
          this.xPos -= distance;
          if (this.hasANewPosition(this.position - 1)) {
            this.position -= 1;
          }
        }
        else {
          canNotMove = true;
        }
      }
    }

    if (this.pressingUp && this.pressingRight) {

      if (this.canMoveUp(distance)) {
        this.yPos -= distance;
        if (this.hasANewPosition(this.position - 15)) {
          this.position -= 15;
        }
        if (this.canMoveRight(distance)) {
          this.xPos += distance;
          if (this.hasANewPosition(this.position + 1)) {
            this.position += 1;
          }
        }
      }
      else {
        if (this.canMoveRight(distance)) {
          this.xPos += distance;
          if (this.hasANewPosition(this.position + 1)) {
            this.position += 1;
          }
        }
        else {
          canNotMove = true;
        }
      }
    }

    if (this.pressingDown && this.pressingLeft) {

      if (this.canMoveDown(distance)) {
        this.yPos += distance;
        if (this.hasANewPosition(this.position + 15)) {
          this.position += 15;
        }
        if (this.canMoveLeft(distance)) {
          this.xPos -= distance;
          if (this.hasANewPosition(this.position - 1)) {
            this.position -= 1;
          }
        }
      }
      else {
        if (this.canMoveLeft(distance)) {
          this.xPos -= distance;
          if (this.hasANewPosition(this.position - 1)) {
            this.position -= 1;
          }
        }
        else {
          canNotMove = true;
        }
      }
    }

    if (this.pressingDown && this.pressingRight) {
      if (this.canMoveDown(distance)) {
        this.yPos += distance;
        if (this.hasANewPosition(this.position + 15)) {
          this.position += 15;
        }
        if (this.canMoveRight(distance)) {
          this.xPos += distance;
          if (this.hasANewPosition(this.position + 1)) {
            this.position += 1;
          }
        }
      }
      else {
        if (this.canMoveRight(distance)) {
          this.xPos += distance;
          if (this.hasANewPosition(this.position + 1)) {
            this.position += 1;
          }
        }
        else {
          canNotMove = true;
        }
      }
    }

    if (this.pressingUp && !this.pressingLeft && !this.pressingRight) {
      if (this.canMoveUp(distance)) {
        this.yPos -= distance;
        if (this.hasANewPosition(this.position - 15)) {
          this.position -= 15;
        }
      } else {
        canNotMove = true;
      }
    }

    if (this.pressingDown && !this.pressingLeft && !this.pressingRight) {
      if (this.canMoveDown(distance)) {
        this.yPos += distance;
        if (this.hasANewPosition(this.position + 15)) {
          this.position += 15;
        }
      } else {
        canNotMove = true;
      }
    }

    if (this.pressingLeft && !this.pressingDown && !this.pressingUp) {
      if (this.canMoveLeft(distance)) {
        this.xPos -= distance;
        if (this.hasANewPosition(this.position - 1)) {
          this.position -= 1;
        }
      } else {
        canNotMove = true;
      }
    }

    if (this.pressingRight && !this.pressingDown && !this.pressingUp) {
      if (this.canMoveRight(distance)) {
        this.xPos += distance;
        if (this.hasANewPosition(this.position + 1)) {
          this.position += 1;
        }

      } else {
        canNotMove = true;
      }
    }
    //Si el jugador tiene la velocidad aumentada y se mueve de 10pixels
    //en 10 pixels, cabe la posibilidad de que se quede bloqueado a 5 pixels
    //de un obstaculo, en tal caso podra hacer un movimiento de 5 pixels
    //para pegarse al obstaculo
    if (distance == 10 && canNotMove) {
      //vuelvo a llamar la funcion pero con una distancia de 5 pixels
      this.updatePosition(5);
    }

  }

  //TODO 
  isInsideAnyPlayerPosition(nextXPos, nextYPos) {

    return false;

  }

  //Comprueba si una bomba inpide el paso
  isBlockedByAnyBomb(xPos, yPos) {

    for (let j = 0; j < GameElements.bombs.length; j++) {
      if (GameElements.bombs[j].playerHasLeft(this.id)) {
        if (this.isInsideElement(xPos, yPos, GameElements.bombs[j])) {
          return true;
        }
      }
    }
    return false;

  }

  //El jugador recupera una bomba,metodo llamado al explotar una bomba
  recoverBomb() {

    this.bombs += 1;

  }

  //El jugador deja una bomba
  dropBomb() {

    let bomb = new Bomb(this.bombRange, this.id);
    this.bombs -= 1;
    GameElements.bombs.push(bomb);

  }

  //Coge un objeto si lo hay en una posicion
  pickItem() {

    let found = false;
    let items = GameElements.items;
    let item;

    //Un jugador solo puede coger un objeto a la vez dado que los 
    //objetos se colocan en posiciones exactas
    for (let i = 0; i < items.length && found == false; i++) {
      if (this.xPos >= items[i].xPos - 45
        && this.xPos < items[i].xPos + 45
        && this.yPos >= items[i].yPos - 45
        && this.yPos < items[i].yPos + 45) {
        item = items[i];
        found = true;
      }
    }
    //Efectos del objeto encontrado
    if (found) {
      switch (item.type) {
        case "ADD_BOMB":
          this.bombs += 1;
          break;
        case "ADD_RANGE":
          this.bombRange += 50;
          break;
        case "BOOTS":
          this.speed = 10;
          break;
        case "KICK_BOMBS":
          this.canThrowBomb = false;
          this.canKickBomb = true;
          break;
        case "THROW_BOMBS":
          this.canKickBomb = false;
          this.canThrowBomb = true;
          break;
      }
      this.inventory.push(item);
      //Se borra del array de objetos
      let index = GameElements.items.indexOf(item);
      GameElements.items.splice(index, 1);
    }

  }

  //Al morir, el jugador suelta todo sus objetos
  dropItems() {

    //Los objetos perdidos apareceran por todo el mapa de manera 
    //aleatoria en posiciones donde no haya paredes ni objetos

    let availableGrounds = [];//Array de posiciones disponibles 

    //Debajo de cada pared y objeto, hay suelo
    //Busco los suelos donde no hay pared ni objetos
    this.inventory.forEach(item => {

      GameElements.grounds.forEach(ground => {

        let isAvailableGround = true;

        GameElements.breakableWalls.forEach(wall => {
          //Si hay un muro,no es una posicion valida
          if (wall.xPos == ground.xPos && wall.yPos == ground.yPos) {
            isAvailableGround = false;
          }
        })
        if (isAvailableGround) {
          GameElements.unbreakableWalls.forEach(wall => {
            //Si hay un muro,no es una posicion valida
            if (wall.xPos == ground.xPos && wall.yPos == ground.yPos) {
              isAvailableGround = false;
            }
          });
        }
        //Si no encuentra pared en ese suelo, busca si hay un objeto
        if (isAvailableGround) {
          GameElements.items.forEach(item => {
            //Si hay un objeto,no es una posicion valida
            if (item.xPos == ground.xPos && item.yPos == ground.yPos) {
              isAvailableGround = false;
            }
          })
        }

        //Si no encuentra nada,es una posicion valida
        if (isAvailableGround) {
          //agrego la posicion al array
          availableGrounds.push(ground);
        }
      })
      //genera un indice aleatorio para elegir un suelo aleatorio 
      //dentro de los suelos disponibles
      let index = Math.floor(Math.random() * (availableGrounds.length - 1));
      let ground = availableGrounds[index];
      item.xPos = ground.xPos;
      item.yPos = ground.yPos;
      GameElements.items.push(item)
      availableGrounds.splice(index, 1);//el suelo ya no esta disponible
    })
    this.inventory = [];

  }

  //Establece la direccion del jugador
  setPressingDirection(direction, state) {

    if (direction === "left") {
      this.pressingLeft = state;
    }
    else if (direction === "right") {
      this.pressingRight = state;
    }
    else if (direction === "up") {
      this.pressingUp = state;
    }
    else if (direction === "down") {
      this.pressingDown = state;
    }
  }

}
module.exports = Player;
