const Element = require('./element.js')
const GameElements = require('./gameElements.js')

class MobileElement extends Element {

    constructor(xPos, yPos) {
        super(xPos, yPos);
        this.speed;
        this.position;
    }

    //Comprueba si una bomba o un jugador puede avanzar hacia arriba
    canMoveUp(distance) {

        let nextYPos = this.yPos - distance;
        let nextXPos = this.xPos;

        if (this.isInsidePosition(this.position - 15, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position - 15);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsidePosition(this.position - 14, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position - 14);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsideAnyPlayerPosition(nextXPos, nextYPos)) {
            return false;
        }
        if (this.isBlockedByAnyBomb(nextXPos, nextYPos)) {
            return false;
        }
        return true;

    }

    //Comprueba si una bomba o un jugador puede avanzar hacia abajo
    canMoveDown(distance) {

        let nextYPos = this.yPos + distance;
        let nextXPos = this.xPos;

        if (this.isInsidePosition(this.position + 15, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position + 15);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsidePosition(this.position + 16, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position + 16);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsideAnyPlayerPosition(nextXPos, nextYPos)) {
            return false;
        }
        if (this.isBlockedByAnyBomb(nextXPos, nextYPos)) {
            return false;
        }
        return true;

    }

    //Comprueba si una bomba o un jugador puede avanzar hacia la izquierda
    canMoveLeft(distance) {

        let nextYPos = this.yPos;
        let nextXPos = this.xPos - distance;

        if (this.isInsidePosition(this.position - 1, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position - 1);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsidePosition(this.position + 14, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position + 14);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsideAnyPlayerPosition(nextXPos, nextYPos)) {
            return false;
        }
        if (this.isBlockedByAnyBomb(nextXPos, nextYPos)) {
            return false;
        }
        return true;

    }

    //Comprueba si una bomba o un jugador puede avanzar hacia la derecha
    canMoveRight(distance) {

        let nextYPos = this.yPos;
        let nextXPos = this.xPos + distance;

        if (this.isInsidePosition(this.position + 1, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position + 1);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsidePosition(this.position + 16, nextXPos, nextYPos)) {
            let element = GameElements.elementsPosition.get(this.position + 16);
            if (element.type == Element.TYPE.UNBREAKABLE_WALL
                || element.type == Element.TYPE.BREAKABLE_WALL) {
                return false;
            }
        }
        if (this.isInsideAnyPlayerPosition(nextXPos, nextYPos)) {
            return false;
        }

        if (this.isBlockedByAnyBomb(nextXPos, nextYPos)) {

            return false;
        }
        return true;

    }

    //Comprueba si las coordenadas de una bomba o de un jugador estan 
    //dentro de una posicion
    isInsidePosition(position, nextXPos, nextYPos) {

        let isInsidePosition = false;
        let xPos = GameElements.elementsPosition.get(position).xPos;
        let yPos = GameElements.elementsPosition.get(position).yPos;

        if (nextXPos > xPos - 50
            && nextXPos < xPos + 50
            && nextYPos > yPos - 50
            && nextYPos < yPos + 50) {
            isInsidePosition = true;
        }
        return isInsidePosition;

    }

    //Comprueba si una bomba o un jugador cambian de posicion
    hasANewPosition(posibleNextPosition) {

        let xPos = GameElements.elementsPosition
            .get(posibleNextPosition).xPos;
        let yPos = GameElements.elementsPosition
            .get(posibleNextPosition).yPos;

        let hasANewPosition = false;
        if (this.xPos >= xPos
            && this.xPos < xPos + 50
            && this.yPos >= yPos
            && this.yPos < yPos + 50) {

            hasANewPosition = true;
        }

        return hasANewPosition;
    }

}
module.exports = MobileElement;