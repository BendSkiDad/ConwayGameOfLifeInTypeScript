export interface BornAndSurviveRule {
    arrBornNeighborCounts: number[]
    arrSurviveNeighborCounts: number[]
}

export interface ICell {
    rowIndex: number,
    columnIndex: number
}

export class Cell implements ICell {
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
    upperLeftCell: ICell
    lowerRightCell: ICell

    constructor(upperLeftCell: ICell, lowerRightCell: ICell) {
        this.upperLeftCell = upperLeftCell
        this.lowerRightCell = lowerRightCell
    }

    expandBy(increment: number): CellExtent {
        this.upperLeftCell.rowIndex -= increment
        this.upperLeftCell.columnIndex -= increment
        this.lowerRightCell.rowIndex += increment
        this.lowerRightCell.columnIndex += increment
        return this
    }

    getExpandedCellExtentToEncompass(otherCellExtent: CellExtent): CellExtent {
        return new CellExtent(
            {
                rowIndex: Math.min(this.upperLeftCell.rowIndex, otherCellExtent.upperLeftCell.rowIndex),
                columnIndex: Math.min(this.upperLeftCell.columnIndex, otherCellExtent.upperLeftCell.columnIndex)        
            },
            {
                rowIndex: Math.max(this.lowerRightCell.rowIndex, otherCellExtent.lowerRightCell.rowIndex),
                columnIndex: Math.max(this.lowerRightCell.columnIndex, otherCellExtent.lowerRightCell.columnIndex)
            }
        )
    }
}

let liveCells: Cell[] = []
let iterationCount: number = 0
let bornAndSurviveRule: BornAndSurviveRule = {
    arrBornNeighborCounts: [3],
    arrSurviveNeighborCounts: [2,3]
}

export function getLiveCells () : readonly Cell[] {
    return liveCells
}

export function getExtentOfCells(cells: readonly ICell[]): CellExtent {
    const rowIndexes: number[] = cells.map(function (cell: ICell): number {
        return cell.rowIndex
      })
      const columnIndexes: number[] = cells.map(function (cell: ICell): number {
        return cell.columnIndex
      })
      const minRowIndex: number = Math.min(...rowIndexes)
      const maxRowIndex: number = Math.max(...rowIndexes)
      const minColumnIndex: number = Math.min(...columnIndexes)
      const maxColumnIndex: number = Math.max(...columnIndexes)
  
      const rc: CellExtent = new CellExtent(
          new Cell(minRowIndex, minColumnIndex),
          new Cell(maxRowIndex, maxColumnIndex)
      )
      return rc
}

export function getExtentOfLiveCells () : CellExtent {
    return getExtentOfCells(liveCells)
}

export function isThereACellInTheLiveListAt (target: ICell): boolean {
    return liveCells.some(function (liveCell: ICell): boolean {
      return liveCell.rowIndex === target.rowIndex && liveCell.columnIndex === target.columnIndex
    })
}

export function isThereALiveCellAt (target: ICell, liveCellList: readonly ICell[]): boolean {
    return liveCellList.some(function (liveCell: ICell): boolean {
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
      getExtentOfLiveCells().expandBy(1)

    const newLiveCells: Cell[] = []
    for (let rowIndex: number = extentOfLiveCellsExpandedBy1.upperLeftCell.rowIndex; rowIndex <= extentOfLiveCellsExpandedBy1.lowerRightCell.rowIndex; rowIndex++) {
      for (let columnIndex: number = extentOfLiveCellsExpandedBy1.upperLeftCell.columnIndex; columnIndex <= extentOfLiveCellsExpandedBy1.lowerRightCell.columnIndex; columnIndex++) {
        const target: ICell = {rowIndex: rowIndex, columnIndex: columnIndex }
        const liveNeighborCount: number =
          deriveNumberOfLiveNeighbors(target)
        if ((isThereACellInTheLiveListAt(target) &&
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

export function addLiveCells(cells: readonly ICell[]): void {
    const cellsToAdd: ICell[] = cells.filter((cell) => !isThereACellInTheLiveListAt(cell))
    cellsToAdd.forEach((c) => liveCells.push(Cell.Create(c)))
}

export function clearLiveCells (): void {
    liveCells = []
}

export function getIterationCount (): number {
    return iterationCount
}

export function getBornAndSurviveRule (): BornAndSurviveRule {
    return bornAndSurviveRule
}

export function setBornAndSurviveRule (rule: BornAndSurviveRule): void {
    bornAndSurviveRule = rule
}
