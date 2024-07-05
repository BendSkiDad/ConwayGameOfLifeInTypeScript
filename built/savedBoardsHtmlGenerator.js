function deriveUnorderedListElement(listItemContents) {
    const listItems = listItemContents.map(function (listItemContent) {
        const rc = document.createElement('li');
        rc.append(listItemContent);
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
        const rc = document.createElement('span');
        rc.append(board.name);
        const liveCellListItemElements = board.liveCells.map(function (liveCell) {
            return "row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex;
        });
        const liveCellsListElement = deriveUnorderedListElement(liveCellListItemElements);
        rc.appendChild(liveCellsListElement);
        return rc;
    });
    const rc = deriveUnorderedListElement(spanElements);
    return rc;
}
export function SavedBoardsHtmlGenerator(containerElement) {
    function updatedSavedBoardsList(boards) {
        const headerElement = deriveHeaderElement();
        const boardsListElement = deriveBoardsListElement(boards);
        containerElement.replaceChildren(headerElement, boardsListElement);
    }
    const rc = {
        updateSavedBoardsList: updatedSavedBoardsList
    };
    return rc;
}
