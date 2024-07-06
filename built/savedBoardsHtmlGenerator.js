import * as HtmlHelpers from "./HtmlHelpers.js";
import { generateBoardAsCanvasElement } from "./boardHtmlGenerator.js";
import * as logic from "./logicTwoDimensional.js";
//todo: move this to the HtmlHelpers file
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
export function SavedBoardsHtmlGenerator(containerElement, boardHtmlGenerator) {
    let savedBoards;
    async function handleDeleteClick() {
        const id = this.getAttribute("data-id");
        if (id) {
            //todo: add error checking to this fetch
            const response = await fetch(`/api/boards/?id=` + id, {
                method: "DELETE"
            });
            const savedBoardsJson = await response.json();
            updateSavedBoardsList(savedBoardsJson.boards);
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
            // const liveCellListItemElements: string[] = board.liveCells.map(function(liveCell): string {
            //     return "row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex
            // })
            // const liveCellsListElement: HTMLUListElement = deriveUnorderedListElement(liveCellListItemElements)
            // rc.appendChild(liveCellsListElement)
            const boardExtent = logic.getExtentOfCells(board.liveCells);
            const canvasElement = generateBoardAsCanvasElement(boardExtent, 10, 10, 1, board.liveCells);
            const canvasContainerElement = document.createElement('p');
            canvasContainerElement.appendChild(canvasElement);
            rc.append(board.name);
            rc.appendChild(deleteButtonElement);
            rc.appendChild(addButtonElement);
            rc.appendChild(canvasContainerElement);
            return rc;
        });
        const rc = deriveUnorderedListElement(spanElements);
        return rc;
    }
    function updateSavedBoardsList(newSavedBoards) {
        savedBoards = newSavedBoards;
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
