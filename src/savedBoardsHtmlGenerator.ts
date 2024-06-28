
export interface ISavedBoardsHtmlGenerator {
    savedBoardsElement: Function
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

function deriveCellListItemElement(liveCell: ICell): HTMLLIElement {
    const cellListItemTextNode = document.createTextNode("row: " + liveCell.rowIndex + " column: " + liveCell.columnIndex)
    const cellListItemElement = document.createElement('li')
    cellListItemElement.appendChild(cellListItemTextNode)
    return cellListItemElement
}

function deriveCellsListElement(liveCells: ICell[]): HTMLUListElement {
    const cellsListElement: HTMLUListElement = document.createElement('ul')
    liveCells.forEach(liveCell => {
        const cellListItemElement = deriveCellListItemElement(liveCell)
        cellsListElement.appendChild(cellListItemElement)
    });
    return cellsListElement
}

function deriveBoardListItemElement(board: ISavedBoard): HTMLLIElement {
    const boardListitemElement = document.createElement('li')
    const boardListItemNameTextNode = document.createTextNode(board.name)
    boardListitemElement.appendChild(boardListItemNameTextNode)
    const cellsListElement: HTMLUListElement = deriveCellsListElement(board.liveCells)
    boardListitemElement.appendChild(cellsListElement)
    return boardListitemElement
}

async function deriveBoardsListElement(): Promise<HTMLUListElement> {
    const boardsListElement: HTMLUListElement = document.createElement('ul')
    const response: Response = await fetch(`/api/boards`)
    const savedBoardsJson = await response.json()
    const boards = savedBoardsJson.boards
    boards.forEach((board: ISavedBoard) => {
        const boardListitemElement = deriveBoardListItemElement(board)
        boardsListElement.appendChild(boardListitemElement)
    })
    return boardsListElement
}

export function SavedBoardsHtmlGenerator() : ISavedBoardsHtmlGenerator {
    async function savedBoardsElement (): Promise<HTMLParagraphElement> {
        const rc: HTMLParagraphElement = document.createElement('p')
        const headerElement: HTMLElement = deriveHeaderElement()
        rc.appendChild(headerElement)
        const boardsListElement: HTMLUListElement = await deriveBoardsListElement()
        rc.appendChild(boardsListElement)
        return rc
    }

    const rc: ISavedBoardsHtmlGenerator = {
        savedBoardsElement
    }

    return rc
}