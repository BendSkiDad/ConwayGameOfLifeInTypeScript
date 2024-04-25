class Cell {
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
    constructor(upperLeft, lowerRight) {
        this.upperLeft = upperLeft;
        this.lowerRight = lowerRight;
    }
}
let liveCells = [];
let iterationCount = 0;
let bornAndSurviveRule = {
    arrBornNeighborCounts: [3],
    arrSurviveNeighborCounts: [2, 3]
};
export function addSimpleGliderGoingUpAndLeft(upperLeftCellOfGlider) {
    liveCells.push(new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex), new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 1), new Cell(upperLeftCellOfGlider.rowIndex, upperLeftCellOfGlider.columnIndex + 2), new Cell(upperLeftCellOfGlider.rowIndex + 1, upperLeftCellOfGlider.columnIndex), new Cell(upperLeftCellOfGlider.rowIndex + 2, upperLeftCellOfGlider.columnIndex));
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
    const rc = {
        upperLeft: {
            rowIndex: minRowIndex,
            columnIndex: minColumnIndex
        },
        lowerRight: {
            rowIndex: maxRowIndex,
            columnIndex: maxColumnIndex
        }
    };
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
    // find indexes just outside the live cells
    const extentOfLiveCellsExpandedBy1 = getExtentOfLiveCells();
    extentOfLiveCellsExpandedBy1.upperLeft.rowIndex -= 1;
    extentOfLiveCellsExpandedBy1.upperLeft.columnIndex -= 1;
    extentOfLiveCellsExpandedBy1.lowerRight.rowIndex += 1;
    extentOfLiveCellsExpandedBy1.lowerRight.columnIndex += 1;
    const newLiveCells = [];
    for (let rowIndex = extentOfLiveCellsExpandedBy1.upperLeft.rowIndex; rowIndex <= extentOfLiveCellsExpandedBy1.lowerRight.rowIndex; rowIndex++) {
        for (let columnIndex = extentOfLiveCellsExpandedBy1.upperLeft.columnIndex; columnIndex <= extentOfLiveCellsExpandedBy1.lowerRight.columnIndex; columnIndex++) {
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
export function getBornAndSuviveRule() {
    return bornAndSurviveRule;
}
export function setBornAndSurviveRule(rule) {
    bornAndSurviveRule = rule;
}
