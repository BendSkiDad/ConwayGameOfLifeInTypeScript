import * as logic from "./logicTwoDimensional.js";
import { BoardHtmlGenerator } from "./boardHtmlGenerator.js";
import { ControlHtmlGenerator } from "./ControlHtmlGenerator.js";
import { SavedBoardsHtmlGenerator } from "./savedBoardsHtmlGenerator.js";
// create and add a container element for the board
const boardContainerElement = document.createElement('p');
boardContainerElement.setAttribute('id', 'board');
const rootElement = document.getElementById('root');
rootElement.appendChild(boardContainerElement);
logic.clearLiveCells();
logic.addSimpleGliderGoingUpAndLeft({ rowIndex: 2, columnIndex: 2 });
logic.addSimpleGliderGoingDownAndRight({ rowIndex: 7, columnIndex: 7 });
const startingUpperLeftCell = new logic.Cell(1, 1);
const startingLowerRightCell = new logic.Cell(10, 20);
const startingBoardExtent = new logic.CellExtent(startingUpperLeftCell, startingLowerRightCell);
const boardHtmlGenerator = BoardHtmlGenerator(startingBoardExtent, boardContainerElement);
const controlHtmlGenerator = ControlHtmlGenerator(boardHtmlGenerator);
boardHtmlGenerator.updateBoardElement();
const controlElements = controlHtmlGenerator.controlElements(0); // iterationCount
controlElements.forEach(element => {
    rootElement.appendChild(element);
});
const response = await fetch(`/api/boards`);
const savedBoardsJson = await response.json();
const savedBoards = savedBoardsJson.boards;
const savedBoardsHtmlGenerator = SavedBoardsHtmlGenerator();
const savedBoardsElement = savedBoardsHtmlGenerator.getSavedBoardsElement(savedBoards);
rootElement.appendChild(savedBoardsElement);
