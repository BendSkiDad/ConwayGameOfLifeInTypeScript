export class Cell {
    constructor(rowIndex, columnIndex) {
        this.rowIndex = rowIndex;
        this.columnIndex = columnIndex;
    }
    isNeighborOf(cell) {
        return this.rowIndex >= cell.rowIndex - 1 &&
            this.rowIndex <= cell.rowIndex + 1 &&
            this.columnIndex >= cell.columnIndex - 1 &&
            this.columnIndex <= cell.columnIndex + 1;
    }
    isMe(target) {
        return this.rowIndex === target.rowIndex && this.columnIndex === target.columnIndex;
    }
    static Create(cell) {
        return new Cell(cell.rowIndex, cell.columnIndex);
    }
}
export class CellExtent {
    constructor(upperLeftCell, lowerRightCell) {
        this.upperLeftCell = upperLeftCell;
        this.lowerRightCell = lowerRightCell;
    }
    expandBy(increment) {
        this.upperLeftCell.rowIndex -= increment;
        this.upperLeftCell.columnIndex -= increment;
        this.lowerRightCell.rowIndex += increment;
        this.lowerRightCell.columnIndex += increment;
        return this;
    }
    getExpandedCellExtentToEncompass(otherCellExtent) {
        return new CellExtent({
            rowIndex: Math.min(this.upperLeftCell.rowIndex, otherCellExtent.upperLeftCell.rowIndex),
            columnIndex: Math.min(this.upperLeftCell.columnIndex, otherCellExtent.upperLeftCell.columnIndex)
        }, {
            rowIndex: Math.max(this.lowerRightCell.rowIndex, otherCellExtent.lowerRightCell.rowIndex),
            columnIndex: Math.max(this.lowerRightCell.columnIndex, otherCellExtent.lowerRightCell.columnIndex)
        });
    }
}
let liveCells = [];
let iterationCount = 0;
let bornAndSurviveRule = {
    arrBornNeighborCounts: [3],
    arrSurviveNeighborCounts: [2, 3]
};
export function getLiveCells() {
    return liveCells;
}
// export function liveCellsAsJSON () : string {
//     return JSON.stringify({
//         liveCells: liveCells })
// }
export function addSimpleGliderGoingUpAndLeft(upperLeftCellOfGlider) {
    liveCells.push(new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex), new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 1), new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 2), new Cell(upperLeftCellOfGlider.rowIndex + 1, upperLeftCellOfGlider.columnIndex), new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex + 1));
}
export function addSimpleGliderGoingDownAndRight(upperLeftCellOfGlider) {
    liveCells.push(new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 1), new Cell(upperLeftCellOfGlider.rowIndex + 1, upperLeftCellOfGlider.columnIndex + 2), new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex), new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex + 1), new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex + 2));
}
export function getExtentOfLiveCells() {
    const rowIndexes = liveCells.map(function (cell) {
        return cell.rowIndex;
    });
    const columnIndexes = liveCells.map(function (cell) {
        return cell.columnIndex;
    });
    const minRowIndex = Math.min(...rowIndexes);
    const maxRowIndex = Math.max(...rowIndexes);
    const minColumnIndex = Math.min(...columnIndexes);
    const maxColumnIndex = Math.max(...columnIndexes);
    const rc = new CellExtent(new Cell(minRowIndex, minColumnIndex), new Cell(maxRowIndex, maxColumnIndex));
    return rc;
}
export function isThereALiveCellAt(target) {
    return liveCells.some(function (liveCell) {
        return liveCell.rowIndex === target.rowIndex && liveCell.columnIndex === target.columnIndex;
    });
}
function deriveNumberOfLiveNeighbors(target) {
    const liveNeighborCells = liveCells.filter(function (liveCell) {
        return liveCell.isNeighborOf(target) && !liveCell.isMe(target);
    });
    return liveNeighborCells.length;
}
function deriveNextSetOfLiveCellsFromCurrentLiveCells() {
    const extentOfLiveCellsExpandedBy1 = getExtentOfLiveCells().expandBy(1);
    const newLiveCells = [];
    for (let rowIndex = extentOfLiveCellsExpandedBy1.upperLeftCell.rowIndex; rowIndex <= extentOfLiveCellsExpandedBy1.lowerRightCell.rowIndex; rowIndex++) {
        for (let columnIndex = extentOfLiveCellsExpandedBy1.upperLeftCell.columnIndex; columnIndex <= extentOfLiveCellsExpandedBy1.lowerRightCell.columnIndex; columnIndex++) {
            const target = { rowIndex: rowIndex, columnIndex: columnIndex };
            const liveNeighborCount = deriveNumberOfLiveNeighbors(target);
            if ((isThereALiveCellAt(target) &&
                bornAndSurviveRule.arrSurviveNeighborCounts.includes(liveNeighborCount)) ||
                bornAndSurviveRule.arrBornNeighborCounts.includes(liveNeighborCount)) {
                newLiveCells.push(new Cell(rowIndex, columnIndex));
            }
        }
    }
    return newLiveCells;
}
export function advanceOneStep() {
    liveCells = deriveNextSetOfLiveCellsFromCurrentLiveCells();
    iterationCount++;
}
export function toggleCellLiveness(target) {
    const index = liveCells.findIndex(function (liveCell) {
        return liveCell.isMe(target);
    });
    if (index === -1) {
        liveCells.push(Cell.Create(target));
    }
    else {
        liveCells.splice(index, 1);
    }
}
export function clearLiveCells() {
    liveCells = [];
}
export function getIterationCount() {
    return iterationCount;
}
export function getBornAndSurviveRule() {
    return bornAndSurviveRule;
}
export function setBornAndSurviveRule(rule) {
    bornAndSurviveRule = rule;
}
