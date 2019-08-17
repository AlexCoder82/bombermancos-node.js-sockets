
const TYPE = {
    BREAKABLE_WALL: "BREAKABLE WALL",
    UNBREAKABLE_WALL: "UNBREAKABLE WALL",
    GROUND: "GROUND"
}

class Element {

    constructor(xPos, yPos, type) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.type = type
    }

    static get TYPE() {
        return TYPE;
    }

    //Comprueba si esta o estará dentro de un elemento 
    isInsideElement(xPos, yPos, element) {

        let isInsideElement = false;
        if (xPos > element.xPos - 50
            && xPos < element.xPos + 50
            && yPos > element.yPos - 50
            && yPos < element.yPos + 50) {
            isInsideElement = true;
        }
        return isInsideElement;

    }

}
module.exports = Element;

