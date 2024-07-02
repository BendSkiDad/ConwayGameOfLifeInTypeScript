function deriveUnorderedListElement(listItemContents) {
    const listItems = listItemContents.map(function (listItemContent) {
        const rc = document.createElement('li');
        rc.appendChild(listItemContent);
        return rc;
    });
    const rc = document.createElement('ul');
    rc.append(...listItems);
    return rc;
}
function deriveHeaderElement() {
    const headerTextNode = document.createTextNode('Saved boards');
    const headerElement = document.createElement('h3');
    headerElement.appendChild(headerTextNode);
    return headerElement;
}
function deriveBoardsListElement(boards) {
    const spanElements = boards.map(function (board) {
        const spanElement = document.createElement('span');
        spanElement.append(board.name);
        const liveCellListItemElements = board.liveCells.map(function (liveCell) {
            const rc = document.createElement('span');
            rc.append("row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex);
            return rc;
        });
        const liveCellsListElement = deriveUnorderedListElement(liveCellListItemElements);
        spanElement.append(liveCellsListElement);
        return spanElement;
    });
    const rc = deriveUnorderedListElement(spanElements);
    return rc;
}
export function SavedBoardsHtmlGenerator() {
    async function savedBoardsElement() {
        const rc = document.createElement('p');
        const headerElement = deriveHeaderElement();
        rc.appendChild(headerElement);
        const response = await fetch(`/api/boards`);
        const savedBoardsJson = await response.json();
        const boards = savedBoardsJson.boards;
        const boardsListElement = deriveBoardsListElement(boards);
        rc.appendChild(boardsListElement);
        return rc;
    }
    const rc = {
        savedBoardsElement
    };
    return rc;
}
