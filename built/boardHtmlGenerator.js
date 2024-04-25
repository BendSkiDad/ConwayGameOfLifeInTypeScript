import * as logic from "./logicTwoDimensional.js";
export class BoardHtmlGenerator {
    constructor(startingBoardExtent, boardContainerElement) {
        this.cellWidth = 13;
        this.cellHeight = 13;
        this.lineBetweenCellsWidth = 1;
        this.currentBoardExtent = startingBoardExtent;
        this.boardContainerElement = boardContainerElement;
    }
    updateCurrentBoardExtentToReflectLiveCells() {
        const extentOfLiveCells = logic.getExtentOfLiveCells();
        // expand currrent board outer coordinates if necessary
        this.currentBoardExtent.upperLeft.rowIndex = Math.min(this.currentBoardExtent.upperLeft.rowIndex, extentOfLiveCells.upperLeft.rowIndex);
        this.currentBoardExtent.upperLeft.columnIndex = Math.min(this.currentBoardExtent.upperLeft.columnIndex, extentOfLiveCells.upperLeft.columnIndex);
        this.currentBoardExtent.lowerRight.rowIndex = Math.max(this.currentBoardExtent.lowerRight.rowIndex, extentOfLiveCells.lowerRight.rowIndex);
        this.currentBoardExtent.lowerRight.columnIndex = Math.max(this.currentBoardExtent.lowerRight.columnIndex, extentOfLiveCells.lowerRight.columnIndex);
    }
    generateBoardAsCanvasHtmlElementFrom() {
        const columnCount = this.currentBoardExtent.lowerRight.columnIndex -
            this.currentBoardExtent.upperLeft.columnIndex + 1;
        const rowCount = this.currentBoardExtent.lowerRight.rowIndex -
            this.currentBoardExtent.upperLeft.rowIndex + 1;
        const canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('id', 'idCanvas');
        canvasElement.width = columnCount * this.cellWidth + columnCount - 1;
        canvasElement.height = rowCount * this.cellHeight + rowCount - 1;
        canvasElement.addEventListener('click', this.handleCanvasClick);
        const ctx = canvasElement.getContext('2d');
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = this.lineBetweenCellsWidth;
        ctx.fillStyle = 'grey';
        for (let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
            for (let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
                const xCoord = canvasColumnIndex * (this.cellWidth + 1);
                const yCoord = canvasRowIndex * (this.cellHeight + 1);
                ctx.strokeRect(xCoord, yCoord, this.cellWidth, this.cellHeight);
                const logicRowIndex = canvasRowIndex + this.currentBoardExtent.upperLeft.rowIndex;
                const logicColumnIndex = canvasColumnIndex + this.currentBoardExtent.upperLeft.columnIndex;
                if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
                    ctx.fillStyle = 'yellow';
                }
                ctx.fillRect(xCoord, yCoord, this.cellWidth, this.cellHeight);
                ctx.fillStyle = 'grey';
            }
        }
        return canvasElement;
    }
    handleCanvasClick(e) {
        const coordinates = {
            rowIndex: Math.trunc(e.offsetY / (this.cellHeight + this.lineBetweenCellsWidth)) + this.currentBoardExtent.upperLeft.rowIndex,
            columnIndex: Math.trunc(e.offsetX / (this.cellWidth + this.lineBetweenCellsWidth)) + this.currentBoardExtent.upperLeft.columnIndex
        };
        logic.toggleCellLiveness(coordinates);
        this.updateBoardElement();
    }
    addRow() {
        this.updateCurrentBoardExtentToReflectLiveCells();
        this.currentBoardExtent.lowerRight.rowIndex += 1;
    }
    addColumn() {
        this.updateCurrentBoardExtentToReflectLiveCells();
        this.currentBoardExtent.lowerRight.columnIndex += 1;
    }
    updateBoardElement() {
        this.updateCurrentBoardExtentToReflectLiveCells();
        const boardAsHtmlCanvasElement = this.generateBoardAsCanvasHtmlElementFrom();
        this.boardContainerElement.replaceChildren(boardAsHtmlCanvasElement);
    }
}
