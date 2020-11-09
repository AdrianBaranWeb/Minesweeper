import { Cell } from "/js/cell.js";
import { UI } from "/js/ui.js";
import { Counter } from "/js/counter.js";
import { Timer } from "/js/timer.js";

class Game extends UI {
  #config = {
    easy: {
      rows: 8,
      cols: 8,
      mines: 10,
    },
    normal: {
      rows: 16,
      cols: 16,
      mines: 40,
    },
    expert: {
      rows: 16,
      cols: 30,
      mines: 99,
    },
  };

  #counter = new Counter();
  #timer = new Timer();

  #isGameFinished = false;
  #numberOfRows = null;
  #numberOfCols = null;
  #numberOfMines = null;

  #cells = [];
  #cellsElements = null;

  #board = null;

  initializeGame() {
    this.#counter.init();
    this.#timer.init();
    this.#handleElements();
    this.#newGame();
  }

  #newGame(
    rows = this.#config.easy.rows,
    cols = this.#config.easy.cols,
    mines = this.#config.easy.mines
  ) {
    this.#numberOfRows = rows;
    this.#numberOfCols = cols;
    this.#numberOfMines = mines;

    this.#counter.setValue(this.#numberOfMines);
    this.#timer.startTimer();

    this.#setStyles();

    this.#generateCells();
    this.#renderBoard();
    this.#placeMinesInCells();

    this.#cellsElements = this.getElements(this.UiSelectors.cell);

    this.#addCellsEventListeners()
  }

  #endGame(isWin){
    this.#isGameFinished = true;
    this.#timer.stopTimer();

    if(!isWin){
      this.#revealMines()
    }
  }

  #addCellsEventListeners(){
    this.#cellsElements.forEach(element => {
      element.addEventListener('click', this.#handleCellClick);
      element.addEventListener('contextmenu', this.#handleCellContextMenu);
    })
  }

  #handleElements() {
    this.#board = this.getElement(this.UiSelectors.board);
  }

  #generateCells() {
    for (let row = 0; row < this.#numberOfRows; row++) {
      this.#cells[row] = [];
      for (let col = 0; col < this.#numberOfCols; col++) {
        this.#cells[row].push(new Cell(col, row));
      }
    }
  }

  #renderBoard() {
    this.#cells.flat().forEach((cell) => {
      this.#board.insertAdjacentHTML("beforeend", cell.createElement());
      cell.element = cell.getElement(cell.selector);
    });
  }

  #placeMinesInCells(){
    let minesToPlace = this.#numberOfMines;
    while(minesToPlace){
      const rowIndex = this.#getRandomIntiger(0, this.#numberOfRows - 1)
      const colIndex = this.#getRandomIntiger(0, this.#numberOfCols - 1)

      const cell = this.#cells[rowIndex][colIndex];

      const hasCellMine = cell.isMine

      if(!hasCellMine){
        cell.addMine()
        minesToPlace--;
      }
    }
  }

  #handleCellClick = e => {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);

    const cell = this.#cells[rowIndex][colIndex];
    if(cell.isFlagged || this.#isGameFinished) return;

    this.#clickCell(cell)
  }

  #handleCellContextMenu = e => {
    e.preventDefault();
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);

    const cell = this.#cells[rowIndex][colIndex];
    if(cell.isReveal || this.#isGameFinished) return;

    if(cell.isFlagged){
      this.#counter.increment();
      cell.toggleFlag();
      return
    }

    if(!!this.#counter.value){
      this.#counter.decrement();
      cell.toggleFlag();
    }
  }

  #clickCell(cell){
    if(this.#isGameFinished || cell.isFlagged) return;
    if(cell.isMine){
      this.#endGame(false);
    }else{
      this.#setCellValue(cell);
    }
  }

  #revealMines(){
    this.#cells.flat().filter(({isMine}) => isMine).forEach(cell => cell.revealCell())
  }

  #setCellValue(cell){
    let mineCount = 0;
    for(let rowIndex = Math.max(cell.y - 1, 0); rowIndex <= Math.min(cell.y + 1, this.#numberOfRows - 1); rowIndex++){
      for(let colIndex = Math.max(cell.x - 1, 0); colIndex <= Math.min(cell.x + 1, this.#numberOfCols - 1); colIndex++){
        if(this.#cells[rowIndex][colIndex].isMine){
          mineCount++;
        }
      }
    }
    cell.value = mineCount;
    cell.revealCell();

    if(!cell.value){
      for(let rowIndex = Math.max(cell.y - 1, 0); rowIndex <= Math.min(cell.y + 1, this.#numberOfRows - 1); rowIndex++){
        for(let colIndex = Math.max(cell.x - 1, 0); colIndex <= Math.min(cell.x + 1, this.#numberOfCols - 1); colIndex++){
          const cell = this.#cells[rowIndex][colIndex];
          if(!cell.isReveal){
            this.#clickCell(cell);
          }
        }
      }
    }
  }

  #setStyles() {
    document.documentElement.style.setProperty("--cells-in-row", this.#numberOfCols);
  }

  #getRandomIntiger(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}

window.onload = function () {
  const game = new Game();
  game.initializeGame();
};