import * as logic from "./logicTwoDimensional.js"

export interface IBoardHtmlGenerator {
    addRow: Function,
    addColumn: Function,
    updateBoardElement: Function
}

export function BoardHtmlGenerator (startingBoardExtent: logic.CellExtent, boardContainerElement: HTMLElement) : IBoardHtmlGenerator {
    let currentBoardExtent: logic.CellExtent = startingBoardExtent
    const cellWidth: number = 20
    const cellHeight: number = cellWidth
    const lineBetweenCellsWidth: number = 1
    function updateCurrentBoardExtentToReflectLiveCells (): void {
        const extentOfLiveCells: logic.CellExtent = logic.getExtentOfLiveCells()
        currentBoardExtent = logic.getCellExtentThatEncompasses(currentBoardExtent, extentOfLiveCells)
    }

    function deriveColumnCount(): number {
        return currentBoardExtent.lowerRightCell.columnIndex -
            currentBoardExtent.upperLeftCell.columnIndex + 1
    }

    function deriveRowCount(): number {
        return currentBoardExtent.lowerRightCell.rowIndex -
            currentBoardExtent.upperLeftCell.rowIndex + 1
    }

    function generateBoardAsCanvasHtmlElement (): HTMLElement {
        const columnCount: number = deriveColumnCount()
        const rowCount: number = deriveRowCount()
        const canvasElement: HTMLCanvasElement = document.createElement('canvas')
        canvasElement.setAttribute('id', 'idCanvas')
        canvasElement.width = (columnCount * cellWidth) + lineBetweenCellsWidth
        canvasElement.height = (rowCount * cellHeight) + lineBetweenCellsWidth
        canvasElement.addEventListener('click', handleCanvasClick)
        const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d') as CanvasRenderingContext2D
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = lineBetweenCellsWidth
        for (let canvasColumnIndex: number = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
            for (let canvasRowIndex: number = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
                const xCoord: number = lineBetweenCellsWidth / 2 + (cellWidth * canvasColumnIndex)
                const yCoord: number = lineBetweenCellsWidth / 2 + (cellHeight * canvasRowIndex)
                const logicRowIndex: number = canvasRowIndex + currentBoardExtent.upperLeftCell.rowIndex
                const logicColumnIndex: number = canvasColumnIndex + currentBoardExtent.upperLeftCell.columnIndex
                if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
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

    function deriveRowIndexFromOffsetY(offsetY: number): number {
        const edgeCellHeight: number = cellHeight + lineBetweenCellsWidth / 2
        const canvasHeight: number = (deriveRowCount() * cellHeight) + lineBetweenCellsWidth
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
        const canvasWidth: number = (deriveColumnCount() * cellWidth) + lineBetweenCellsWidth
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
        const boardAsHtmlCanvasElement: HTMLElement = generateBoardAsCanvasHtmlElement()
        boardContainerElement.replaceChildren(boardAsHtmlCanvasElement)
    }

    const rc: IBoardHtmlGenerator = {
        addRow,
        addColumn,
        updateBoardElement
    }

    return rc
}
