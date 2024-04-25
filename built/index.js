import * as logic from "./logicTwoDimensional.js";
import { BoardHtmlGenerator } from "./boardHtmlGenerator.js";
import { ControlHtmlGenerator } from "./ControlHtmlGenerator.js";
// create and add a container element for the board
const boardContainerElement = document.createElement('p');
boardContainerElement.setAttribute('id', 'board');
const rootElement = document.getElementById('root');
rootElement.appendChild(boardContainerElement);
logic.clearLiveCells();
logic.addSimpleGliderGoingUpAndLeft({ rowIndex: 2, columnIndex: 2 });
logic.addSimpleGliderGoingDownAndRight({ rowIndex: 7, columnIndex: 7 });
let startingBoardExtent = {
    upperLeft: {
        rowIndex: 1,
        columnIndex: 1
    },
    lowerRight: {
        rowIndex: 10,
        columnIndex: 10
    }
};
const boardHtmlGenerator = new BoardHtmlGenerator(startingBoardExtent, boardContainerElement);
const controlHtmlGenerator = new ControlHtmlGenerator(boardHtmlGenerator);
boardHtmlGenerator.updateBoardElement();
const controlElements = controlHtmlGenerator.controlElements(0); // iterationCount
controlElements.forEach(element => {
    rootElement.appendChild(element);
});
