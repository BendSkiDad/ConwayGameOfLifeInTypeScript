import * as HtmlHelpers from "./HtmlHelpers";
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
export function SavedBoardsHtmlGenerator(containerElement) {
    async function handleDeleteClick() {
        //todo: add error checking to this fetch
        const response = await fetch(`/api/boards/?id=` + `3`, {
            method: "DELETE"
        });
        const savedBoardsJson = await response.json();
        const savedBoards = savedBoardsJson.boards;
        updateSavedBoardsList(savedBoards);
    }
    function deriveBoardsListElement(boards) {
        const spanElements = boards.map(function (board) {
            const rc = document.createElement('span');
            const deleteButtonElement = HtmlHelpers.deriveButton("Delete", handleDeleteClick);
            rc.append(board.name);
            rc.appendChild(deleteButtonElement);
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
    function updateSavedBoardsList(boards) {
        const headerElement = deriveHeaderElement();
        const boardsListElement = deriveBoardsListElement(boards);
        containerElement.replaceChildren(headerElement, boardsListElement);
    }
    const rc = {
        updateSavedBoardsList: updateSavedBoardsList
    };
    return rc;
}
