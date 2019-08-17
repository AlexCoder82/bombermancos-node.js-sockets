const GameElements = require('./gameElements.js')
const Element = require('./element.js')

class Explosion {

    constructor(xPos, yPos, flames, wallsToBreakPosition) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.flames = flames;
        this.wallsToBreakPosition = wallsToBreakPosition;
        this.time = 10;
    }

    //Rompe objetos al explotar
    breaksItems() {

        GameElements.items.forEach(item => {
            //Comprueba que el item no este aun escondido por el muro
            let position = GameElements.getPosition(item.xPos, item.yPos);
            let element = GameElements.elementsPosition.get(position);
            if (element.type == Element.TYPE.GROUND) {
                //Comprueba si elcentro de la explosion destruye objetos
                if (item.isInsideElement(item.xPos,item.yPos,this)) {
                    let index = GameElements.items.indexOf(item);
                    GameElements.items.splice(index, 1);
                }
                //Comprueba si las llamas de la exlosion matan a jugadores
                this.flames.forEach(flame => {
                    if (item.isInsideElement(item.xPos,item.yPos,flame)) {
                        let index = GameElements.items.indexOf(item);
                        GameElements.items.splice(index, 1);
                    }
                });
            }
        });

    }

    breaksWalls() {

        for (let i = 0; i < this.wallsToBreakPosition.length; i++) {

            let position = this.wallsToBreakPosition[i];
            let wall = GameElements.elementsPosition.get(position);
            wall.type = Element.TYPE.GROUND;
            GameElements.elementsPosition.set(position, wall);
            let index = GameElements.breakableWalls.indexOf(wall);
            GameElements.breakableWalls.splice(index, 1);
        }

    }

    //La explosion provoca la explosion de otras bombas
    makesBombsExplode() {

        GameElements.bombs.forEach(bomb => {
            if (bomb.isInsideElement(bomb.xPos, bomb.yPos, this)) {
                bomb.time = 1;//Deja la bomba a punto de explotar
            }
            this.flames.forEach(flame => {
                if (bomb.isInsideElement(bomb.xPos, bomb.yPos, flame)) {
                    bomb.time = 1;//Deja la bomba a punto de explotar
                }
            });
        });

    }

    //La explosion mata a jugadores
    killsPlayers() {

        GameElements.players.forEach(player => {
            //Comprueba si el centro de la explosion mata a jugadores  
            if (player.isInsideElement(player.xPos, player.yPos, this)
                && player.isDead == false) {
                //Mata a un jugador  si aun esta vivo
                player.isDead = true;
                player.dropItems();
            }
            //Comprueba si las llamas de la exlosion matan a jugadores
            this.flames.forEach(flame => {
                if (player.isInsideElement(player.xPos, player.yPos, flame)
                    && player.isDead == false) {
                    //Mata a un jugador si aun esta vivo  
                    player.isDead = true;
                    player.dropItems();
                }
            });
        });

    }

}
module.exports = Explosion;