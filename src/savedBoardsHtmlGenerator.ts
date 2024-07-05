import * as HtmlHelpers from "./HtmlHelpers"

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

interface ICell {
    rowIndex: number,
    columnIndex: number
}

export interface ISavedBoard {
    id: number,
    name: string,
    liveCells: ICell[]
}

export interface ISavedBoardsHtmlGenerator {
    updateSavedBoardsList: Function
}

export function SavedBoardsHtmlGenerator(containerElement: HTMLElement) : ISavedBoardsHtmlGenerator {
    async function handleDeleteClick (): Promise<void> {
        //todo: add error checking to this fetch
        const response: Response = await fetch(
            `/api/boards/?id=` + `3`,
            {
                method: "DELETE"
            })
        const savedBoardsJson = await response.json()
        const savedBoards: ISavedBoard[] = savedBoardsJson.boards
        updateSavedBoardsList(savedBoards)
    }

    function deriveBoardsListElement(boards: ISavedBoard[]): HTMLUListElement {
        const spanElements: HTMLSpanElement[] = boards.map(function(board: ISavedBoard): HTMLSpanElement {
            const rc: HTMLSpanElement = document.createElement('span')
            const deleteButtonElement = HtmlHelpers.deriveButton("Delete", handleDeleteClick)
    
            rc.append(board.name)
            rc.appendChild(deleteButtonElement)
    
            const liveCellListItemElements: string[] = board.liveCells.map(function(liveCell): string {
                return "row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex
            })
            const liveCellsListElement: HTMLUListElement = deriveUnorderedListElement(liveCellListItemElements)
            rc.appendChild(liveCellsListElement)
            return rc
        })
        const rc: HTMLUListElement = deriveUnorderedListElement(spanElements)
        return rc
    }
    
    function updateSavedBoardsList (boards: ISavedBoard[]): void {
        const headerElement: HTMLElement = deriveHeaderElement()
        const boardsListElement: HTMLUListElement = deriveBoardsListElement(boards)
        containerElement.replaceChildren(headerElement, boardsListElement)
    }

    const rc: ISavedBoardsHtmlGenerator = {
        updateSavedBoardsList: updateSavedBoardsList
    }

    return rc
}