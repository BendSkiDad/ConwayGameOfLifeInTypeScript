import * as logic from "./logicTwoDimensional.js"
import { BoardHtmlGenerator, IBoardHtmlGenerator } from "./boardHtmlGenerator.js"
import { ControlHtmlGenerator, IControlHtmlGenerator } from "./ControlHtmlGenerator.js"

// create and add a container element for the board
const boardContainerElement: HTMLParagraphElement = document.createElement('p')
boardContainerElement.setAttribute('id', 'board')
const rootElement: HTMLElement = document.getElementById('root') as HTMLElement
rootElement.appendChild(boardContainerElement)

logic.clearLiveCells()
logic.addSimpleGliderGoingUpAndLeft({ rowIndex: 2, columnIndex: 2 })
logic.addSimpleGliderGoingDownAndRight({ rowIndex: 7, columnIndex: 7 })

const startingBoardExtent: logic.CellExtent = {
    upperLeftCell: {
        rowIndex: 1,
        columnIndex: 1
    },
    lowerRightCell: {
        rowIndex: 10,
        columnIndex: 20
    }
}
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
