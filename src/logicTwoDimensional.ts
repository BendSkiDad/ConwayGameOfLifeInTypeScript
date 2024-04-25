export interface BornAndSurviveRule {
    arrBornNeighborCounts: number[]
    arrSurviveNeighborCounts: number[]
}

export interface ICell {
    rowIndex: number,
    columnIndex: number
}

class Cell implements ICell {
    rowIndex: number
    columnIndex: number

    constructor(rowIndex: number, columnIndex: number) {
        this.rowIndex = rowIndex
        this.columnIndex = columnIndex
    }

    isNeighborOf(cell: ICell): boolean {
        return this.rowIndex >= cell.rowIndex - 1 &&
            this.rowIndex <= cell.rowIndex + 1 &&
            this.columnIndex >= cell.columnIndex - 1 &&
            this.columnIndex <= cell.columnIndex + 1
    }

    isMe(target: ICell): boolean {
        return this.rowIndex === target.rowIndex && this.columnIndex === target.columnIndex
    }

    static Create(cell: ICell): Cell {
        return new Cell(cell.rowIndex, cell.columnIndex)
    }
}

export class CellExtent {
    upperLeft: ICell
    lowerRight: ICell

    constructor(upperLeft: ICell, lowerRight: ICell) {
        this.upperLeft = upperLeft
        this.lowerRight = lowerRight
    }
}

function incrementCellExtent (target: CellExtent, increment: number): CellExtent {
    target.upperLeft.rowIndex -= increment
    target.upperLeft.columnIndex -= increment
    target.lowerRight.rowIndex += increment
    target.lowerRight.columnIndex += increment
    return target
}

export function getCellExtentThatEncompasses(first: CellExtent, second: CellExtent) {
    return new CellExtent(
        {
            rowIndex: Math.min(first.upperLeft.rowIndex, second.upperLeft.rowIndex),
            columnIndex: Math.min(first.upperLeft.columnIndex, second.upperLeft.columnIndex)        
        },
        {
            rowIndex: Math.max(first.lowerRight.rowIndex, second.lowerRight.rowIndex),
            columnIndex: Math.max(first.lowerRight.columnIndex, second.lowerRight.columnIndex)
        })
}


let liveCells: Cell[] = []
let iterationCount: number = 0
let bornAndSurviveRule: BornAndSurviveRule = {
    arrBornNeighborCounts: [3],
    arrSurviveNeighborCounts: [2,3]
}

export function addSimpleGliderGoingUpAndLeft (upperLeftCellOfGlider: ICell) : void {
    liveCells.push(
        new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex),
        new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 1),
        new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 2),
        new Cell(upperLeftCellOfGlider.rowIndex + 1, upperLeftCellOfGlider.columnIndex),
        new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex + 1)
    )
}

export function addSimpleGliderGoingDownAndRight (upperLeftCellOfGlider: ICell) : void {
    liveCells.push(
        new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 1),
        new Cell(upperLeftCellOfGlider.rowIndex + 1, upperLeftCellOfGlider.columnIndex + 2),
        new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex),
        new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex + 1),
        new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex + 2)
    )
}

export function getExtentOfLiveCells () : CellExtent {
    const rowIndexes: number[] = liveCells.map(function (cell: ICell): number {
      return cell.rowIndex
    })
    const columnIndexes: number[] = liveCells.map(function (cell: ICell): number {
      return cell.columnIndex
    })
    const minRowIndex: number = Math.min(...rowIndexes)
    const maxRowIndex: number = Math.max(...rowIndexes)
    const minColumnIndex: number = Math.min(...columnIndexes)
    const maxColumnIndex: number = Math.max(...columnIndexes)

    const rc: CellExtent = {
        upperLeft: {
            rowIndex: minRowIndex,
            columnIndex: minColumnIndex
        },
        lowerRight: {
            rowIndex: maxRowIndex,
            columnIndex: maxColumnIndex
        }
    }
    return rc
}

export function isThereALiveCellAt (target: ICell): boolean {
    return liveCells.some(function (liveCell: ICell): boolean {
      return liveCell.rowIndex === target.rowIndex && liveCell.columnIndex === target.columnIndex
    })
}

function deriveNumberOfLiveNeighbors (target: ICell): number {
    const liveNeighborCells: ICell[] = liveCells.filter(function (liveCell) {
      return liveCell.isNeighborOf(target) && !liveCell.isMe(target)
    })
    return liveNeighborCells.length
}

function deriveNextSetOfLiveCellsFromCurrentLiveCells (): Cell[] {
    const extentOfLiveCellsExpandedBy1: CellExtent =
        incrementCellExtent(getExtentOfLiveCells(), 1)

    const newLiveCells: Cell[] = []
    for (let rowIndex: number = extentOfLiveCellsExpandedBy1.upperLeft.rowIndex; rowIndex <= extentOfLiveCellsExpandedBy1.lowerRight.rowIndex; rowIndex++) {
      for (let columnIndex: number = extentOfLiveCellsExpandedBy1.upperLeft.columnIndex; columnIndex <= extentOfLiveCellsExpandedBy1.lowerRight.columnIndex; columnIndex++) {
        const target: ICell = {rowIndex: rowIndex, columnIndex: columnIndex }
        const liveNeighborCount: number =
          deriveNumberOfLiveNeighbors(target)
        if ((isThereALiveCellAt(target) &&
             bornAndSurviveRule.arrSurviveNeighborCounts.includes(liveNeighborCount)
            ) ||
            bornAndSurviveRule.arrBornNeighborCounts.includes(liveNeighborCount)
        ) {
          newLiveCells.push(new Cell(rowIndex, columnIndex))
        }
      }
    }
    return newLiveCells
}

export function advanceOneStep (): void {
    liveCells = deriveNextSetOfLiveCellsFromCurrentLiveCells()
    iterationCount++
}

export function toggleCellLiveness (target: ICell): void {
    const index = liveCells.findIndex(function (liveCell) {
      return liveCell.isMe(target)
    })
    if (index === -1) {
      liveCells.push(Cell.Create(target))
    } else {
      liveCells.splice(index, 1)
    }
}

export function clearLiveCells (): void {
    liveCells = []
}

export function getIterationCount (): number {
    return iterationCount
}

export function getBornAndSuviveRule (): BornAndSurviveRule {
    return bornAndSurviveRule
}

export function setBornAndSurviveRule (rule: BornAndSurviveRule): void {
    bornAndSurviveRule = rule
}
