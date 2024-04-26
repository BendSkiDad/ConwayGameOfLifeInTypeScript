import * as logic from "./logicTwoDimensional.js";
export function BoardHtmlGenerator(startingBoardExtent, boardContainerElement) {
    let currentBoardExtent = startingBoardExtent;
    const cellWidth = 13;
    const cellHeight = 13;
    const lineBetweenCellsWidth = 1;
    function updateCurrentBoardExtentToReflectLiveCells() {
        const liveCellsExtent = logic.getExtentOfLiveCells();
        currentBoardExtent = logic.getCellExtentThatEncompasses(currentBoardExtent, liveCellsExtent);
    }
    function generateBoardAsCanvasHtmlElementFrom() {
        const columnCount = currentBoardExtent.lowerRight.columnIndex -
            currentBoardExtent.upperLeft.columnIndex + 1;
        const rowCount = currentBoardExtent.lowerRight.rowIndex -
            currentBoardExtent.upperLeft.rowIndex + 1;
        const canvasElement = document.createElement('canvas');
        canvasElement.setAttribute('id', 'idCanvas');
        canvasElement.width = columnCount * cellWidth + columnCount - 1;
        canvasElement.height = rowCount * cellHeight + rowCount - 1;
        canvasElement.addEventListener('click', handleCanvasClick);
        const ctx = canvasElement.getContext('2d');
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = lineBetweenCellsWidth;
        ctx.fillStyle = 'grey';
        for (let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
            for (let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
                const xCoord = canvasColumnIndex * (cellWidth + 1);
                const yCoord = canvasRowIndex * (cellHeight + 1);
                ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight);
                const logicRowIndex = canvasRowIndex + currentBoardExtent.upperLeft.rowIndex;
                const logicColumnIndex = canvasColumnIndex + currentBoardExtent.upperLeft.columnIndex;
                if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
                    ctx.fillStyle = 'yellow';
                }
                ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight);
                ctx.fillStyle = 'grey';
            }
        }
        return canvasElement;
    }
    function handleCanvasClick(e) {
        const coordinates = {
            rowIndex: Math.trunc(e.offsetY / (cellHeight + lineBetweenCellsWidth)) + currentBoardExtent.upperLeft.rowIndex,
            columnIndex: Math.trunc(e.offsetX / (cellWidth + lineBetweenCellsWidth)) + currentBoardExtent.upperLeft.columnIndex
        };
        logic.toggleCellLiveness(coordinates);
        updateBoardElement();
    }
    function addRow() {
        updateCurrentBoardExtentToReflectLiveCells();
        currentBoardExtent.lowerRight.rowIndex += 1;
    }
    function addColumn() {
        updateCurrentBoardExtentToReflectLiveCells();
        currentBoardExtent.lowerRight.columnIndex += 1;
    }
    function updateBoardElement() {
        updateCurrentBoardExtentToReflectLiveCells();
        const boardAsHtmlCanvasElement = generateBoardAsCanvasHtmlElementFrom();
        boardContainerElement.replaceChildren(boardAsHtmlCanvasElement);
    }
    return {
        addRow,
        addColumn,
        updateBoardElement
    };
}
