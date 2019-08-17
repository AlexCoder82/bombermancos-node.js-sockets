const Element = require('./element.js')

const TYPE = {
  ADD_BOMB: "ADD_BOMB",
  ADD_RANGE: "ADD_RANGE",
  BOOTS: "BOOTS",
  KICK_BOMBS: "KICK_BOMBS",
  THROW_BOMBS: "THROW_BOMBS"
};

class Item extends Element {

  constructor(xPos, yPos, type) {
    super(xPos, yPos);
    this.type = type;
  }

  static get TYPE() {
    return TYPE;
  }
  
}

module.exports = Item;