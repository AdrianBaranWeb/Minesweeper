import { Cell } from "/js/cell.js";
import { UI } from "/js/ui.js";
import { Counter } from "/js/counter.js";

class Game extends UI {
  #config = {
    easy: {
      rows: 8,
      cols: 8,
      mines: 10,
    },
    medium: {
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

  #numberOfRows = null;
  #numberOfCols = null;
  #numberOfMines = null;

  #cells = [];
  #cellsElements = null;

  #board = null;

  initializeGame() {
    this.#counter.init();
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

    this.#setStyles();

    this.#generateCells();
    this.#renderBoard();

    this.#cellsElements = this.getElements(this.UiSelectors.cell);

    this.#addCellsEventListeners()
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

  #handleCellClick = e => {
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);

    //i add this two lines
    const cell = this.#cells[rowIndex][colIndex];
    if(cell.isFlagged) return;

    this.#cells[rowIndex][colIndex].revealCell()
  }

  #handleCellContextMenu = e => {
    e.preventDefault();
    const target = e.target;
    const rowIndex = parseInt(target.getAttribute('data-y'), 10);
    const colIndex = parseInt(target.getAttribute('data-x'), 10);

    const cell = this.#cells[rowIndex][colIndex];
    if(cell.isReveal) return;

    if(cell.isFlagged){
      this.#counter.increment();
    }

    cell.toggleFlag();
  }

  #setStyles() {
    document.documentElement.style.setProperty("--cells-in-row", this.#numberOfCols);
  }
}

window.onload = function () {
  const game = new Game();
  game.initializeGame();
};
