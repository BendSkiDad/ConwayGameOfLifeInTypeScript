function deriveHeaderElement() {
    const headerTextNode = document.createTextNode('Saved boards');
    const headerElement = document.createElement('h3');
    headerElement.appendChild(headerTextNode);
    return headerElement;
}
function deriveCellListItemElement(liveCell) {
    const cellListItemTextNode = document.createTextNode("row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex);
    const cellListItemElement = document.createElement('li');
    cellListItemElement.appendChild(cellListItemTextNode);
    return cellListItemElement;
}
function deriveCellsListElement(liveCells) {
    const cellsListElement = document.createElement('ul');
    liveCells.forEach(liveCell => {
        const cellListItemElement = deriveCellListItemElement(liveCell);
        cellsListElement.appendChild(cellListItemElement);
    });
    return cellsListElement;
}
function deriveBoardListItemElement(board) {
    const boardListitemElement = document.createElement('li');
    const boardListItemNameTextNode = document.createTextNode(board.name);
    boardListitemElement.appendChild(boardListItemNameTextNode);
    const cellsListElement = deriveCellsListElement(board.liveCells);
    boardListitemElement.appendChild(cellsListElement);
    return boardListitemElement;
}
async function deriveBoardsListElement() {
    const boardsListElement = document.createElement('ul');
    const response = await fetch(`/api/boards`);
    const savedBoardsJson = await response.json();
    const boards = savedBoardsJson.boards;
    boards.forEach((board) => {
        const boardListitemElement = deriveBoardListItemElement(board);
        boardsListElement.appendChild(boardListitemElement);
    });
    return boardsListElement;
}
export function SavedBoardsHtmlGenerator() {
    async function savedBoardsElement() {
        const rc = document.createElement('p');
        const headerElement = deriveHeaderElement();
        rc.appendChild(headerElement);
        const boardsListElement = await deriveBoardsListElement();
        rc.appendChild(boardsListElement);
        return rc;
    }
    const rc = {
        savedBoardsElement
    };
    return rc;
}
