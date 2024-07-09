import * as HtmlHelpers from "./HtmlHelpers.js"
import { IBoardHtmlGenerator, generateBoardAsCanvasElement } from "./boardHtmlGenerator.js"
import * as logic from "./logicTwoDimensional.js"

//todo: move this to the HtmlHelpers file
function deriveUnorderedListElement(listItemContents: HTMLElement[] | string[]): HTMLUListElement {
    const listItems: HTMLLIElement[] = listItemContents.map(function(listItemContent: HTMLElement | string) {
        const rc: HTMLLIElement = document.createElement('li')
        rc.append(listItemContent)
        return rc
    })
    const rc: HTMLUListElement = document.createElement('ul')
    rc.append(...listItems)
    return rc
}

function deriveHeaderElement(): HTMLElement {
    const headerTextNode: Text = document.createTextNode('Saved boards')
    const headerElement: HTMLElement = document.createElement('h3')
    headerElement.appendChild(headerTextNode)
    return headerElement
}

export interface ISavedBoard {
    id: number,
    name: string,
    liveCells: readonly logic.ICell[]
}

export interface ISavedBoardsHtmlGenerator {
    updateSavedBoardsList: Function
}

export function SavedBoardsHtmlGenerator(containerElement: HTMLElement, boardHtmlGenerator: IBoardHtmlGenerator) : ISavedBoardsHtmlGenerator {
    let savedBoards: ISavedBoard[]

    async function handleDeleteClick (this: HTMLElement): Promise<void> {
        const id: string | null = this.getAttribute("data-id")
        if(id) {
            //todo: add error checking to this fetch
            const response: Response = await fetch(
                `/api/boards/?id=` + id,
                {
                    method: "DELETE"
                })
            const savedBoardsJson = await response.json()
            updateSavedBoardsList(savedBoardsJson.boards)
        }
    }

    async function handleAddClick (this: HTMLElement): Promise<void> {
        const id: string | null = this.getAttribute("data-id")
        if(id) {
            const board: ISavedBoard = savedBoards.filter((b) => b.id === Number(id))[0]
            logic.addLiveCells(board.liveCells)
            boardHtmlGenerator.updateBoardElement()
        }
    }

    function deriveBoardsListElement(boards: ISavedBoard[]): HTMLUListElement {
        const spanElements: HTMLSpanElement[] = boards.map(function(board: ISavedBoard): HTMLSpanElement {
            const rc: HTMLSpanElement = document.createElement('span')

            const deleteButtonElement = HtmlHelpers.deriveButton("Delete", handleDeleteClick)
            deleteButtonElement.setAttribute('data-id', board.id.toString())

            const addButtonElement = HtmlHelpers.deriveButton("Add to current board", handleAddClick)
            addButtonElement.setAttribute('data-id', board.id.toString())
    
            // const liveCellListItemElements: string[] = board.liveCells.map(function(liveCell): string {
            //     return "row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex
            // })
            // const liveCellsListElement: HTMLUListElement = deriveUnorderedListElement(liveCellListItemElements)
            // rc.appendChild(liveCellsListElement)

            const boardExtent: logic.CellExtent = logic.getExtentOfCells(board.liveCells)
            const canvasElement: HTMLCanvasElement = generateBoardAsCanvasElement(boardExtent, 10, 10, 1, board.liveCells)
            const canvasContainerElement: HTMLParagraphElement = document.createElement('p')
            canvasContainerElement.appendChild(canvasElement)

            rc.append(board.name)
            rc.appendChild(deleteButtonElement)
            rc.appendChild(addButtonElement)
            rc.appendChild(canvasContainerElement)
    
            return rc
        })
        const rc: HTMLUListElement = deriveUnorderedListElement(spanElements)
        return rc
    }
    
    function updateSavedBoardsList (newSavedBoards: ISavedBoard[]): void {
        savedBoards = newSavedBoards
        if(savedBoards && savedBoards.length) {
            const headerElement: HTMLElement = deriveHeaderElement()
            const boardsListElement: HTMLUListElement = deriveBoardsListElement(savedBoards)
            containerElement.replaceChildren(headerElement, boardsListElement)
        } else {
            containerElement.replaceChildren()
        }
    }

    const rc: ISavedBoardsHtmlGenerator = {
        updateSavedBoardsList: updateSavedBoardsList
    }

    return rc
}