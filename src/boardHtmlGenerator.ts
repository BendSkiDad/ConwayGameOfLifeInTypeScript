import * as logic from "./logicTwoDimensional.js"

export interface IBoardHtmlGenerator {
    addRow: Function,
    addColumn: Function,
    updateBoardElement: Function
}

export function BoardHtmlGenerator (startingBoardExtent: logic.CellExtent, boardContainerElement: HTMLElement) {
    let currentBoardExtent: logic.CellExtent = startingBoardExtent

    const cellWidth: number = 13
    const cellHeight: number = 13
    const lineBetweenCellsWidth: number = 1

    function updateCurrentBoardExtentToReflectLiveCells (): void{
        const liveCellsExtent: logic.CellExtent = logic.getExtentOfLiveCells()
        currentBoardExtent = logic.getCellExtentThatEncompasses(currentBoardExtent, liveCellsExtent)
  }

    function generateBoardAsCanvasHtmlElementFrom (): HTMLElement {
        const columnCount: number = currentBoardExtent.lowerRight.columnIndex -
            currentBoardExtent.upperLeft.columnIndex + 1
        const rowCount: number = currentBoardExtent.lowerRight.rowIndex -
            currentBoardExtent.upperLeft.rowIndex + 1
        const canvasElement: HTMLCanvasElement = document.createElement('canvas')
        canvasElement.setAttribute('id', 'idCanvas')
        canvasElement.width = columnCount * cellWidth + columnCount - 1
        canvasElement.height = rowCount * cellHeight + rowCount - 1
        canvasElement.addEventListener('click', handleCanvasClick)
        const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d') as CanvasRenderingContext2D
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = lineBetweenCellsWidth
        ctx.fillStyle = 'grey'
        for (let canvasColumnIndex: number = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
            for (let canvasRowIndex: number = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
                const xCoord: number = canvasColumnIndex * (cellWidth + 1)
                const yCoord: number = canvasRowIndex * (cellHeight + 1)
                ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight)
                const logicRowIndex: number = canvasRowIndex + currentBoardExtent.upperLeft.rowIndex
                const logicColumnIndex: number = canvasColumnIndex + currentBoardExtent.upperLeft.columnIndex
                if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
                    ctx.fillStyle = 'yellow'
                }
                ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight)
                ctx.fillStyle = 'grey'
            }
        }
        return canvasElement
    }

    function handleCanvasClick (e: MouseEvent) : void {
        const coordinates: logic.ICell = {
            rowIndex: Math.trunc(e.offsetY / (cellHeight + lineBetweenCellsWidth)) + currentBoardExtent.upperLeft.rowIndex,
            columnIndex: Math.trunc(e.offsetX / (cellWidth + lineBetweenCellsWidth)) + currentBoardExtent.upperLeft.columnIndex
        }
        logic.toggleCellLiveness(coordinates)
        updateBoardElement()
    }

    function addRow (): void {
        updateCurrentBoardExtentToReflectLiveCells()
        currentBoardExtent.lowerRight.rowIndex += 1
    }

    function addColumn (): void {
        updateCurrentBoardExtentToReflectLiveCells()
        currentBoardExtent.lowerRight.columnIndex += 1
    }

    function updateBoardElement (): void {
        updateCurrentBoardExtentToReflectLiveCells()
        const boardAsHtmlCanvasElement: HTMLElement = generateBoardAsCanvasHtmlElementFrom()
        boardContainerElement.replaceChildren(boardAsHtmlCanvasElement)
    }

    return {
        addRow,
        addColumn,
        updateBoardElement
    }
}
