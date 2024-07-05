import * as logic from "./logicTwoDimensional.js"
import { BoardHtmlGenerator, IBoardHtmlGenerator } from "./boardHtmlGenerator.js"
import { ControlHtmlGenerator, IControlHtmlGenerator } from "./ControlHtmlGenerator.js"
import { ISavedBoard, SavedBoardsHtmlGenerator, ISavedBoardsHtmlGenerator } from "./savedBoardsHtmlGenerator.js"

const response: Response = await fetch(`/api/boards`)
const savedBoardsJson = await response.json()
const savedBoards: ISavedBoard[] = savedBoardsJson.boards

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

const rootElement: HTMLElement = document.getElementById('root') as HTMLElement

// create container elements
const boardContainerElement: HTMLParagraphElement = document.createElement('p')
const buttonContainerElement: HTMLParagraphElement = document.createElement('p')
const savedBoardsContainerElement: HTMLParagraphElement = document.createElement('p')

const boardHtmlGenerator: IBoardHtmlGenerator =
    BoardHtmlGenerator(startingBoardExtent, boardContainerElement)
boardHtmlGenerator.updateBoardElement()
const savedBoardsHtmlGenerator: ISavedBoardsHtmlGenerator =
    SavedBoardsHtmlGenerator(savedBoardsContainerElement, boardHtmlGenerator, savedBoards)
const startingIterationCount: number = 0
const controlHtmlGenerator : IControlHtmlGenerator =
    ControlHtmlGenerator(boardHtmlGenerator, startingIterationCount, savedBoardsHtmlGenerator)

buttonContainerElement.appendChild(controlHtmlGenerator.advanceOneStepButtonElement)
buttonContainerElement.appendChild(controlHtmlGenerator.addRowButtonElement)
buttonContainerElement.appendChild(controlHtmlGenerator.addColumnButtonElement)
buttonContainerElement.appendChild(controlHtmlGenerator.resetButtonElement)
buttonContainerElement.appendChild(controlHtmlGenerator.runButtonElement)

rootElement.appendChild(controlHtmlGenerator.ruleDescriptionElement)
rootElement.appendChild(boardContainerElement)
rootElement.appendChild(controlHtmlGenerator.iterationCountContainerElement)
rootElement.appendChild(buttonContainerElement)
rootElement.appendChild(controlHtmlGenerator.saveContainerElement)

savedBoardsHtmlGenerator.updateSavedBoardsList()
rootElement.appendChild(savedBoardsContainerElement)
