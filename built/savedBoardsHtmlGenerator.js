import * as HtmlHelpers from "./HtmlHelpers.js";
import * as logic from "./logicTwoDimensional.js";
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
export function SavedBoardsHtmlGenerator(containerElement, boardHtmlGenerator, savedBoards) {
    async function handleDeleteClick() {
        const id = this.getAttribute("data-id");
        if (id) {
            //todo: add error checking to this fetch
            const response = await fetch(`/api/boards/?id=` + id, {
                method: "DELETE"
            });
            const savedBoardsJson = await response.json();
            savedBoards = savedBoardsJson.boards;
            updateSavedBoardsList();
        }
    }
    async function handleAddClick() {
        const id = this.getAttribute("data-id");
        if (id) {
            const board = savedBoards.filter((b) => b.id === Number(id))[0];
            logic.addLiveCells(board.liveCells);
            boardHtmlGenerator.updateBoardElement();
        }
    }
    function deriveBoardsListElement(boards) {
        const spanElements = boards.map(function (board) {
            const rc = document.createElement('span');
            const deleteButtonElement = HtmlHelpers.deriveButton("Delete", handleDeleteClick);
            deleteButtonElement.setAttribute('data-id', board.id.toString());
            const addButtonElement = HtmlHelpers.deriveButton("Add to current board", handleAddClick);
            addButtonElement.setAttribute('data-id', board.id.toString());
            rc.append(board.name);
            rc.appendChild(deleteButtonElement);
            rc.appendChild(addButtonElement);
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
    function updateSavedBoardsList() {
        if (savedBoards && savedBoards.length) {
            const headerElement = deriveHeaderElement();
            const boardsListElement = deriveBoardsListElement(savedBoards);
            containerElement.replaceChildren(headerElement, boardsListElement);
        }
        else {
            containerElement.replaceChildren();
        }
    }
    const rc = {
        updateSavedBoardsList: updateSavedBoardsList
    };
    return rc;
}
