function deriveUnorderedListElement(listItemContents: HTMLElement[]): HTMLUListElement {
    const listItems: HTMLLIElement[] = listItemContents.map(function(listItemContent: HTMLElement) {
        const rc: HTMLLIElement = document.createElement('li')
        rc.appendChild(listItemContent)
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

interface ISavedBoard {
    name: string,
    liveCells: ICell[]
}

function deriveBoardsListElement(boards: ISavedBoard[]): HTMLUListElement {
    const spanElements: HTMLSpanElement[] = boards.map(function(board: ISavedBoard): HTMLSpanElement {
        const spanElement: HTMLSpanElement = document.createElement('span')
        spanElement.append(board.name)
        const liveCellListItemElements: HTMLSpanElement[] = board.liveCells.map(function(liveCell): HTMLSpanElement {
            const rc = document.createElement('span')
            rc.append("row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex)
            return rc
        })
        const liveCellsListElement: HTMLUListElement = deriveUnorderedListElement(liveCellListItemElements)
        spanElement.append(liveCellsListElement)
        return spanElement
    })
    const rc: HTMLUListElement = deriveUnorderedListElement(spanElements)
    return rc
}

export interface ISavedBoardsHtmlGenerator {
    savedBoardsElement: Function
}

export function SavedBoardsHtmlGenerator() : ISavedBoardsHtmlGenerator {
    async function savedBoardsElement (): Promise<HTMLParagraphElement> {
        const rc: HTMLParagraphElement = document.createElement('p')
        const headerElement: HTMLElement = deriveHeaderElement()
        rc.appendChild(headerElement)

        const response: Response = await fetch(`/api/boards`)
        const savedBoardsJson = await response.json()
        const boards: ISavedBoard[] = savedBoardsJson.boards

        const boardsListElement: HTMLUListElement = deriveBoardsListElement(boards)
        rc.appendChild(boardsListElement)
        return rc
    }

    const rc: ISavedBoardsHtmlGenerator = {
        savedBoardsElement
    }

    return rc
}