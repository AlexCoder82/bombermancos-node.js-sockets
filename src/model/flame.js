const Element = require('./element.js')

const AXIS = {
    VERTICAL: "VERTICAL",
    HORIZONTAL: "HORIZONTAL"
}

class Flame extends Element {

    constructor(xPos, yPos, axis) {
        super(xPos, yPos)
        this.axis = axis;
    }

    static get AXIS() {
        return AXIS;
    }

}
module.exports = Flame;