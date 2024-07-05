import * as logic from "./logicTwoDimensional.js";
function deriveColumnCount(boardExtent) {
    return boardExtent.lowerRightCell.columnIndex -
        boardExtent.upperLeftCell.columnIndex + 1;
}
function deriveRowCount(boardExtent) {
    return boardExtent.lowerRightCell.rowIndex -
        boardExtent.upperLeftCell.rowIndex + 1;
}
export function generateBoardAsCanvasElement(boardExtent, cellWidth, cellHeight, lineBetweenCellsWidth) {
    const columnCount = deriveColumnCount(boardExtent);
    const rowCount = deriveRowCount(boardExtent);
    const canvasElement = document.createElement('canvas');
    canvasElement.width = (columnCount * cellWidth) + lineBetweenCellsWidth;
    canvasElement.height = (rowCount * cellHeight) + lineBetweenCellsWidth;
    const ctx = canvasElement.getContext('2d');
    ctx.strokeStyle = 'blue';
    ctx.lineWidth = lineBetweenCellsWidth;
    for (let canvasColumnIndex = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
        for (let canvasRowIndex = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
            const xCoord = lineBetweenCellsWidth / 2 + (cellWidth * canvasColumnIndex);
            const yCoord = lineBetweenCellsWidth / 2 + (cellHeight * canvasRowIndex);
            const logicRowIndex = canvasRowIndex + boardExtent.upperLeftCell.rowIndex;
            const logicColumnIndex = canvasColumnIndex + boardExtent.upperLeftCell.columnIndex;
            if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
                ctx.fillStyle = 'yellow';
            }
            else {
                ctx.fillStyle = 'grey';
            }
            ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight);
            ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight);
        }
    }
    return canvasElement;
}
export function BoardHtmlGenerator(startingBoardExtent, boardContainerElement) {
    let currentBoardExtent = startingBoardExtent;
    const cellWidth = 20;
    const cellHeight = cellWidth;
    const lineBetweenCellsWidth = 1;
    function updateCurrentBoardExtentToReflectLiveCells() {
        const extentOfLiveCells = logic.getExtentOfLiveCells();
        currentBoardExtent = currentBoardExtent.getExpandedCellExtentToEncompass(extentOfLiveCells);
    }
    function generateBoardAsCanvasHtmlElement() {
        const canvasElement = generateBoardAsCanvasElement(currentBoardExtent, cellWidth, cellHeight, lineBetweenCellsWidth);
        canvasElement.addEventListener('click', handleCanvasClick);
        return canvasElement;
    }
    function deriveRowIndexFromOffsetY(offsetY) {
        const edgeCellHeight = cellHeight + lineBetweenCellsWidth / 2;
        const canvasHeight = (deriveRowCount(currentBoardExtent) * cellHeight) + lineBetweenCellsWidth;
        const topOfBottomCellOffset = canvasHeight - edgeCellHeight;
        if (offsetY < edgeCellHeight) {
            return currentBoardExtent.upperLeftCell.rowIndex;
        }
        else if (offsetY > topOfBottomCellOffset) {
            return currentBoardExtent.lowerRightCell.rowIndex;
        }
        else {
            return Math.trunc((offsetY - edgeCellHeight) / cellHeight) + 1 + currentBoardExtent.upperLeftCell.rowIndex;
        }
    }
    function deriveColumnIndexFromOffsetX(offsetX) {
        const edgeCellWidth = cellHeight + lineBetweenCellsWidth / 2;
        const canvasWidth = (deriveColumnCount(currentBoardExtent) * cellWidth) + lineBetweenCellsWidth;
        const leftOfRightCellOffset = canvasWidth - edgeCellWidth;
        if (offsetX < edgeCellWidth) {
            return currentBoardExtent.upperLeftCell.columnIndex;
        }
        else if (offsetX > leftOfRightCellOffset) {
            return currentBoardExtent.lowerRightCell.columnIndex;
        }
        else {
            return Math.trunc((offsetX - edgeCellWidth) / cellWidth) + 1 + currentBoardExtent.upperLeftCell.columnIndex;
        }
    }
    function handleCanvasClick(e) {
        const cell = {
            rowIndex: deriveRowIndexFromOffsetY(e.offsetY),
            columnIndex: deriveColumnIndexFromOffsetX(e.offsetX)
        };
        logic.toggleCellLiveness(cell);
        updateBoardElement();
    }
    function addRow() {
        updateCurrentBoardExtentToReflectLiveCells();
        currentBoardExtent.lowerRightCell.rowIndex += 1;
    }
    function addColumn() {
        updateCurrentBoardExtentToReflectLiveCells();
        currentBoardExtent.lowerRightCell.columnIndex += 1;
    }
    function updateBoardElement() {
        updateCurrentBoardExtentToReflectLiveCells();
        const boardAsHtmlCanvasElement = generateBoardAsCanvasHtmlElement();
        boardContainerElement.replaceChildren(boardAsHtmlCanvasElement);
    }
    const rc = {
        addRow,
        addColumn,
        updateBoardElement
    };
    return rc;
}
