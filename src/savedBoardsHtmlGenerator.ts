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
    name: string,
    liveCells: ICell[]
}

function deriveBoardsListElement(boards: ISavedBoard[]): HTMLUListElement {
    const spanElements: HTMLSpanElement[] = boards.map(function(board: ISavedBoard): HTMLSpanElement {
        const rc: HTMLSpanElement = document.createElement('span')
        rc.append(board.name)
        
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
    getSavedBoardsElement: Function
}

export function SavedBoardsHtmlGenerator() : ISavedBoardsHtmlGenerator {
    function getSavedBoardsElement (boards: ISavedBoard[]): HTMLParagraphElement {
        const rc: HTMLParagraphElement = document.createElement('p')
        const headerElement: HTMLElement = deriveHeaderElement()
        rc.appendChild(headerElement)

        const boardsListElement: HTMLUListElement = deriveBoardsListElement(boards)
        rc.appendChild(boardsListElement)
        return rc
    }

    const rc: ISavedBoardsHtmlGenerator = {
        getSavedBoardsElement: getSavedBoardsElement
    }

    return rc
}