export class UI{
    UiSelectors = {
        board: '[data-board]',
        cell: '[data-cell]',
        counter: '[data-counter]',
        timer: '[data-timer]',
        resetButton: '[data-button-reset]',
        easyButton: '[data-button-easy]',
        normalButton: '[data-button-normal]',
        expertButton: '[data-button-expert]',
        ownButton: '[data-button-own]',
        modal: '[data-modal]',
        modalHeader: '[data-modal-header]',
        modalButton: '[data-modal-button]',
        difficultyModal: '[data-difficulty-modal]',
        ownRows: '[data-own-rows]',
        ownCols: '[data-own-cols]',
        ownMines: '[data-own-mines]',
        difficultyButtonCanceled: '[data-difficulty-button-canceled]',
        ownDifficulty: '[data-difficulty-button-accept]',
        ownRows: '[data-own-rows]',
        ownCols: '[data-own-cols]',
        ownMines: '[data-own-mines]',
    }

    getElement(selector){
        return document.querySelector(selector)
    }

    getElements(selector){
        return document.querySelectorAll(selector)
    }
}