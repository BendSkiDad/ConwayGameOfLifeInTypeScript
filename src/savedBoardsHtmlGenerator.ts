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

function deriveBoardsListElement(boards: ISavedBoard[]): HTMLUListElement {
    const spanElements: HTMLSpanElement[] = boards.map(function(board: ISavedBoard): HTMLSpanElement {
        const rc: HTMLSpanElement = document.createElement('span')
        rc.append(board.name + " with id of " + board.id)

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

export interface ISavedBoardsHtmlGenerator {
    updateSavedBoardsList: Function
}

export function SavedBoardsHtmlGenerator(containerElement: HTMLElement) : ISavedBoardsHtmlGenerator {
    function updatedSavedBoardsList (boards: ISavedBoard[]): void {
        const headerElement: HTMLElement = deriveHeaderElement()
        const boardsListElement: HTMLUListElement = deriveBoardsListElement(boards)
        containerElement.replaceChildren(headerElement, boardsListElement)
    }

    const rc: ISavedBoardsHtmlGenerator = {
        updateSavedBoardsList: updatedSavedBoardsList
    }

    return rc
}