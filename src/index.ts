import * as logic from "./logicTwoDimensional.js"
import { BoardHtmlGenerator, IBoardHtmlGenerator } from "./boardHtmlGenerator.js"
import { ControlHtmlGenerator, IControlHtmlGenerator } from "./ControlHtmlGenerator.js"
import { ISavedBoard, SavedBoardsHtmlGenerator, ISavedBoardsHtmlGenerator } from "./savedBoardsHtmlGenerator.js"

// create and add a container element for the board
const boardContainerElement: HTMLParagraphElement = document.createElement('p')
boardContainerElement.setAttribute('id', 'board')
const rootElement: HTMLElement = document.getElementById('root') as HTMLElement
rootElement.appendChild(boardContainerElement)

logic.clearLiveCells()
logic.addSimpleGliderGoingUpAndLeft({ rowIndex: 2, columnIndex: 2 })
logic.addSimpleGliderGoingDownAndRight({ rowIndex: 7, columnIndex: 7 })

const startingUpperLeftCell: logic.Cell = new logic.Cell(1, 1)
const startingLowerRightCell: logic.Cell = new logic.Cell(10, 20)
const startingBoardExtent: logic.CellExtent =
  new logic.CellExtent(
      startingUpperLeftCell,
      startingLowerRightCell
  )
const boardHtmlGenerator: IBoardHtmlGenerator =
    BoardHtmlGenerator(startingBoardExtent, boardContainerElement)
const controlHtmlGenerator : IControlHtmlGenerator =
    ControlHtmlGenerator(boardHtmlGenerator)
boardHtmlGenerator.updateBoardElement()
const controlElements: HTMLElement[] =
    controlHtmlGenerator.controlElements(0) // iterationCount
controlElements.forEach(element => {
    rootElement.appendChild(element)
})

const response: Response = await fetch(`/api/boards`)
const savedBoardsJson = await response.json()
const savedBoards: ISavedBoard[] = savedBoardsJson.boards

const savedBoardsHtmlGenerator: ISavedBoardsHtmlGenerator = SavedBoardsHtmlGenerator()
const savedBoardsElement: HTMLElement = savedBoardsHtmlGenerator.savedBoardsElement(savedBoards)
rootElement.appendChild(savedBoardsElement)
