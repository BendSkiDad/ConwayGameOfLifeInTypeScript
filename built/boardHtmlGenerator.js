import * as logic from "./logicTwoDimensional.js";
export function BoardHtmlGenerator(startingBoardExtent, boardContainerElement) {
    let currentBoardExtent = startingBoardExtent;
    const cellWidth = 13;
    const cellHeight = cellWidth;
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
        canvasElement.width = (columnCount * cellWidth) + lineBetweenCellsWidth;
        canvasElement.height = (rowCount * cellHeight) + lineBetweenCellsWidth;
        canvasElement.addEventListener('click', handleCanvasClick);
        const ctx = canvasElement.getContext('2d');
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = lineBetweenCellsWidth;
        ctx.fillStyle = 'grey';
        for (let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
            for (let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
                const xCoord = cellWidth * canvasColumnIndex + lineBetweenCellsWidth / 2;
                const yCoord = cellHeight * canvasRowIndex + lineBetweenCellsWidth / 2;
                const logicRowIndex = canvasRowIndex + currentBoardExtent.upperLeft.rowIndex;
                const logicColumnIndex = canvasColumnIndex + currentBoardExtent.upperLeft.columnIndex;
                if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
                    ctx.fillStyle = 'yellow';
                }
                ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight);
                ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight);
                ctx.fillStyle = 'grey';
            }
        }
        return canvasElement;
    }
    function handleCanvasClick(e) {
        const coordinates = {
            rowIndex: Math.trunc(e.offsetY / (cellHeight + lineBetweenCellsWidth / 2)) + currentBoardExtent.upperLeft.rowIndex,
            columnIndex: Math.trunc(e.offsetX / (cellWidth + lineBetweenCellsWidth / 2)) + currentBoardExtent.upperLeft.columnIndex
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
        // const liveCellsAsJSON = logic.liveCellsAsJSON()
        // const textNode = document.createTextNode(liveCellsAsJSON)
        // const pElement = document.createElement('p')
        // pElement.appendChild(textNode)
        // boardContainerElement.replaceChildren(boardAsHtmlCanvasElement, pElement)
    }
    const rc = {
        addRow,
        addColumn,
        updateBoardElement
    };
    return rc;
}
