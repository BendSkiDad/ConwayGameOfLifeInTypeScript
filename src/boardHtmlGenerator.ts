import * as logic from "./logicTwoDimensional.js"

export interface IBoardHtmlGenerator {
    addRow: Function,
    addColumn: Function,
    updateBoardElement: Function
}

function deriveColumnCount(boardExtent: logic.CellExtent): number {
    return boardExtent.lowerRightCell.columnIndex -
        boardExtent.upperLeftCell.columnIndex + 1
}

function deriveRowCount(boardExtent: logic.CellExtent): number {
    return boardExtent.lowerRightCell.rowIndex -
        boardExtent.upperLeftCell.rowIndex + 1
}

export function generateBoardAsCanvasElement (boardExtent: logic.CellExtent, cellWidth: number, cellHeight: number, lineBetweenCellsWidth: number, liveCellList: readonly logic.ICell[]): HTMLCanvasElement {
    const columnCount: number = deriveColumnCount(boardExtent)
    const rowCount: number = deriveRowCount(boardExtent)
    const canvasElement: HTMLCanvasElement = document.createElement('canvas')
    canvasElement.width = (columnCount * cellWidth) + lineBetweenCellsWidth
    canvasElement.height = (rowCount * cellHeight) + lineBetweenCellsWidth
    const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d') as CanvasRenderingContext2D
    ctx.strokeStyle = 'blue'
    ctx.lineWidth = lineBetweenCellsWidth
    for (let canvasColumnIndex: number = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
        for (let canvasRowIndex: number = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
            const xCoord: number = lineBetweenCellsWidth / 2 + (cellWidth * canvasColumnIndex)
            const yCoord: number = lineBetweenCellsWidth / 2 + (cellHeight * canvasRowIndex)
            const logicRowIndex: number = canvasRowIndex + boardExtent.upperLeftCell.rowIndex
            const logicColumnIndex: number = canvasColumnIndex + boardExtent.upperLeftCell.columnIndex
            if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex }, liveCellList)) {
                ctx.fillStyle = 'yellow'
            } else {
                ctx.fillStyle = 'grey'
            }
            ctx.fillRect(xCoord, yCoord, cellWidth, cellHeight)
            ctx.strokeRect(xCoord, yCoord, cellWidth, cellHeight)
        }
    }
    return canvasElement
}

export function BoardHtmlGenerator (startingBoardExtent: logic.CellExtent, boardContainerElement: HTMLElement) : IBoardHtmlGenerator {
    let currentBoardExtent: logic.CellExtent = startingBoardExtent
    const cellWidth: number = 20
    const cellHeight: number = cellWidth
    const lineBetweenCellsWidth: number = 1

    function generateBoardWithClickListenerAsCanvasElement (): HTMLElement {
        const canvasElement: HTMLCanvasElement = generateBoardAsCanvasElement(currentBoardExtent, cellWidth, cellHeight, lineBetweenCellsWidth, logic.getLiveCells())
        canvasElement.addEventListener('click', handleCanvasClick)
        return canvasElement
    }

    function deriveRowIndexFromOffsetY(offsetY: number): number {
        const edgeCellHeight: number = cellHeight + lineBetweenCellsWidth / 2
        const canvasHeight: number = (deriveRowCount(currentBoardExtent) * cellHeight) + lineBetweenCellsWidth
        const topOfBottomCellOffset: number = canvasHeight - edgeCellHeight
        if (offsetY < edgeCellHeight) {
            return currentBoardExtent.upperLeftCell.rowIndex
        } else if (offsetY > topOfBottomCellOffset) {
            return currentBoardExtent.lowerRightCell.rowIndex
        } else {
            return  Math.trunc((offsetY - edgeCellHeight) / cellHeight) + 1 + currentBoardExtent.upperLeftCell.rowIndex
        }
    }

    function deriveColumnIndexFromOffsetX(offsetX: number): number {
        const edgeCellWidth: number = cellHeight + lineBetweenCellsWidth / 2
        const canvasWidth: number = (deriveColumnCount(currentBoardExtent) * cellWidth) + lineBetweenCellsWidth
        const leftOfRightCellOffset: number = canvasWidth - edgeCellWidth
        if (offsetX < edgeCellWidth) {
            return currentBoardExtent.upperLeftCell.columnIndex
        } else if (offsetX > leftOfRightCellOffset) {
            return currentBoardExtent.lowerRightCell.columnIndex
        } else {
            return  Math.trunc((offsetX - edgeCellWidth) / cellWidth) + 1 + currentBoardExtent.upperLeftCell.columnIndex
        }
    }

    function handleCanvasClick (e: MouseEvent) : void {
        const cell: logic.ICell = {
            rowIndex: deriveRowIndexFromOffsetY(e.offsetY),
            columnIndex: deriveColumnIndexFromOffsetX(e.offsetX)
        }
        logic.toggleCellLiveness(cell)
        updateBoardElement()
    }

    function updateCurrentBoardExtentToReflectLiveCells (): void {
        const extentOfLiveCells: logic.CellExtent =
            logic.getExtentOfLiveCells()
        currentBoardExtent =
            currentBoardExtent.getExpandedCellExtentToEncompass(extentOfLiveCells)
    }

    function addRow (): void {
        updateCurrentBoardExtentToReflectLiveCells()
        currentBoardExtent.lowerRightCell.rowIndex += 1
    }

    function addColumn (): void {
        updateCurrentBoardExtentToReflectLiveCells()
        currentBoardExtent.lowerRightCell.columnIndex += 1
    }

    function updateBoardElement (): void {
        updateCurrentBoardExtentToReflectLiveCells()
        const boardAsHtmlCanvasElement: HTMLElement =
            generateBoardWithClickListenerAsCanvasElement()
        boardContainerElement.replaceChildren(boardAsHtmlCanvasElement)
    }

    const rc: IBoardHtmlGenerator = {
        addRow,
        addColumn,
        updateBoardElement
    }

    return rc
}
