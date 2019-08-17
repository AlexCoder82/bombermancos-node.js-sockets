
//LISTAS ESTATICAS DE TODOS LOS ELEMENTOS DEL JUEGO
let players = [];
let unbreakableWalls = [];
let grounds = [];
let items = [];
let breakableWalls = [];
let explosions = [];
let bombs = [];
//Asigna las posiciones de cada elemento a un numero 
let elementsPosition = new Map();

class GameElements {

    //Retorna la posicion segun las coordenadas
    static getPosition(xPos,yPos){

        let found = false;
        let position = 0;
        while(!found && position < 195){
            position++;     
            if(xPos >= elementsPosition.get(position).xPos
            && xPos < elementsPosition.get(position).xPos +50
                && yPos >= elementsPosition.get(position).yPos
                && yPos < elementsPosition.get(position).yPos + 50){
                    found = true;
                }
        }
        return position;

    }

    static get players() {
        return players;
    }

    static get breakableWalls() {
        return breakableWalls;
    }

    static get explosions() {
        return explosions;
    }

    static get unbreakableWalls() {
        return unbreakableWalls;
    }

    static get grounds() {
        return grounds;
    }

    static get items() {
        return items;
    }  

    static get elementsPosition() {
        return elementsPosition;
    }

    static get bombs(){
        return bombs;
    }

}

module.exports = GameElements;