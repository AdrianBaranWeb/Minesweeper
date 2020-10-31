import {Cell} from '/js/cell.js'

class Game{
    #config = {
        easy: {
            rows: 8,
            cols: 8,
            mines: 10
        },
        medium: {
            rows: 16,
            cols: 16,
            mines: 40
        },
        expert: {
            rows: 16,
            cols: 30,
            mines: 99
        }
    }
    
    #numeberOfRows = null;
    #numeberOfCols = null;
    #numeberOfMines = null;

    #cells = [];

    initialiazeGame(){
        this.#newGame()
    }
    
    #newGame(rows = this.#config.easy.rows, cols = this.#config.easy.cols, mines = this.#config.easy.mines){
        this.#numeberOfRows = rows; 
        this.#numeberOfCols = cols; 
        this.#numeberOfMines = mines; 

        this.#generateCells();
    }

    #generateCells(){
        for(let row = 0; row < this.#numeberOfRows; row++){
            this.#cells[row] = [];
            for(let col = 0; col < this.#numeberOfCols; col++){
                this.#cells[row].push(new Cell(col, row))
            }
        }
    }
}

window.onload = function(){
    const game = new Game();
    game.initialiazeGame();
}