import * as logic from "./logicTwoDimensional.js"

export class BoardHtmlGenerator {
    private currentBoardExtent: logic.CellExtent
    private boardContainerElement: HTMLElement

    constructor(startingBoardExtent: logic.CellExtent, boardContainerElement: HTMLElement) {
        this.currentBoardExtent = startingBoardExtent
        this.boardContainerElement = boardContainerElement
    }

    private cellWidth: number = 13
    private cellHeight: number = 13
    private lineBetweenCellsWidth: number = 1

    private updateCurrentBoardExtentToReflectLiveCells (): void{
        const extentOfLiveCells: logic.CellExtent = logic.getExtentOfLiveCells()

        // expand currrent board outer coordinates if necessary
        this.currentBoardExtent.upperLeft.rowIndex = Math.min(
            this.currentBoardExtent.upperLeft.rowIndex,
            extentOfLiveCells.upperLeft.rowIndex)
            this.currentBoardExtent.upperLeft.columnIndex = Math.min(
                this.currentBoardExtent.upperLeft.columnIndex,
                extentOfLiveCells.upperLeft.columnIndex)
            this.currentBoardExtent.lowerRight.rowIndex = Math.max(
                this.currentBoardExtent.lowerRight.rowIndex,
                extentOfLiveCells.lowerRight.rowIndex)
            this.currentBoardExtent.lowerRight.columnIndex = Math.max(
                this.currentBoardExtent.lowerRight.columnIndex,
                extentOfLiveCells.lowerRight.columnIndex)
  }

    private generateBoardAsCanvasHtmlElementFrom (): HTMLElement {
        const columnCount: number = this.currentBoardExtent.lowerRight.columnIndex -
            this.currentBoardExtent.upperLeft.columnIndex + 1
        const rowCount: number = this.currentBoardExtent.lowerRight.rowIndex -
            this.currentBoardExtent.upperLeft.rowIndex + 1
        const canvasElement: HTMLCanvasElement = document.createElement('canvas')
        canvasElement.setAttribute('id', 'idCanvas')
        canvasElement.width = columnCount * this.cellWidth + columnCount - 1
        canvasElement.height = rowCount * this.cellHeight + rowCount - 1
        canvasElement.addEventListener('click', this.handleCanvasClick)
        const ctx: CanvasRenderingContext2D = canvasElement.getContext('2d') as CanvasRenderingContext2D
        ctx.strokeStyle = 'blue'
        ctx.lineWidth = this.lineBetweenCellsWidth
        ctx.fillStyle = 'grey'
        for (let canvasColumnIndex: number = 0; canvasColumnIndex < columnCount; canvasColumnIndex++) {
            for (let canvasRowIndex: number = 0; canvasRowIndex < rowCount; canvasRowIndex++) {
                const xCoord: number = canvasColumnIndex * (this.cellWidth + 1)
                const yCoord: number = canvasRowIndex * (this.cellHeight + 1)
                ctx.strokeRect(xCoord, yCoord, this.cellWidth, this.cellHeight)
                const logicRowIndex: number = canvasRowIndex + this.currentBoardExtent.upperLeft.rowIndex
                const logicColumnIndex: number = canvasColumnIndex + this.currentBoardExtent.upperLeft.columnIndex
                if (logic.isThereALiveCellAt({ rowIndex: logicRowIndex, columnIndex: logicColumnIndex })) {
                    ctx.fillStyle = 'yellow'
                }
                ctx.fillRect(xCoord, yCoord, this.cellWidth, this.cellHeight)
                ctx.fillStyle = 'grey'
            }
        }
        return canvasElement
    }

    private handleCanvasClick (e: MouseEvent) : void {
        const coordinates: logic.ICell = {
            rowIndex: Math.trunc(e.offsetY / (this.cellHeight + this.lineBetweenCellsWidth)) + this.currentBoardExtent.upperLeft.rowIndex,
            columnIndex: Math.trunc(e.offsetX / (this.cellWidth + this.lineBetweenCellsWidth)) + this.currentBoardExtent.upperLeft.columnIndex
        }
        logic.toggleCellLiveness(coordinates)
        this.updateBoardElement()
    }

    public addRow (): void {
        this.updateCurrentBoardExtentToReflectLiveCells()
        this.currentBoardExtent.lowerRight.rowIndex += 1
    }

    public addColumn (): void {
        this.updateCurrentBoardExtentToReflectLiveCells()
        this.currentBoardExtent.lowerRight.columnIndex += 1
    }

    public updateBoardElement (): void {
        this.updateCurrentBoardExtentToReflectLiveCells()
        const boardAsHtmlCanvasElement: HTMLElement = this.generateBoardAsCanvasHtmlElementFrom()
        this.boardContainerElement.replaceChildren(boardAsHtmlCanvasElement)
    }
}
