import * as logic from "./logicTwoDimensional.js";
import { SavedBoardsHtmlGenerator } from "./savedBoardsHtmlGenerator.js";
export function ControlHtmlGenerator(boardHtmlGenerator, startingIterationCount) {
    const runButtonElement = deriveButton('Run', handleRunClick);
    const iterationCountElement = document.createElement('span');
    const ruleDescriptionElement = deriveRuleDescriptionElement();
    const iterationCountContainerElement = deriveIterationCountParagraph(startingIterationCount);
    const advanceOneStepButtonElement = deriveButton('Advance a step', handleAdvanceAStepClick);
    const addRowButtonElement = deriveButton('Add Row', handleAddRowClick);
    const addColumnButtonElement = deriveButton('Add Column', handleAddColumnClick);
    const resetButtonElement = deriveButton('Clear', handleClearClick);
    const saveContainerElement = deriveSaveContainerElement();
    const buttonsContainerElement = deriveButtonsContainerElement();
    let interval = 0;
    let isRunning = false;
    function renderRunStopButtonAsRun() {
        runButtonElement.value = 'Run';
    }
    function renderRunStopButtonAsStop() {
        runButtonElement.value = 'Stop';
    }
    function updateIterationCount() {
        iterationCountElement.textContent = logic.getIterationCount().toString();
    }
    function deriveRuleDescriptionElement() {
        const rule = logic.getBornAndSurviveRule();
        const ruleText = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('');
        const textNode = document.createTextNode(ruleText);
        const pElement = document.createElement('p');
        pElement.appendChild(textNode);
        return pElement;
    }
    function deriveIterationCountParagraph(iterationCount) {
        const labelTextNode = document.createTextNode('Iteration Count:');
        const countTextNode = document.createTextNode(iterationCount.toString());
        iterationCountElement.appendChild(countTextNode);
        const pElement = document.createElement('p');
        pElement.appendChild(labelTextNode);
        pElement.appendChild(iterationCountElement);
        return pElement;
    }
    function deriveButton(value, fnClickHandler) {
        const button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', value);
        if (fnClickHandler) {
            button.addEventListener('click', fnClickHandler);
        }
        button.classList.add('button');
        return button;
    }
    function deriveButtonsContainerElement() {
        const buttonContainerElement = document.createElement('div');
        buttonContainerElement.appendChild(advanceOneStepButtonElement);
        buttonContainerElement.appendChild(addRowButtonElement);
        buttonContainerElement.appendChild(addColumnButtonElement);
        buttonContainerElement.appendChild(resetButtonElement);
        buttonContainerElement.appendChild(runButtonElement);
        buttonContainerElement.appendChild(saveContainerElement);
        return buttonContainerElement;
    }
    function deriveSaveContainerElement() {
        const textInputElement = document.createElement('input');
        textInputElement.setAttribute('type', 'text');
        textInputElement.setAttribute('id', 'idSaveName');
        const saveButtonElement = deriveButton('Save', handleSaveClick);
        const pElement = document.createElement('p');
        pElement.appendChild(textInputElement);
        pElement.appendChild(saveButtonElement);
        return pElement;
    }
    function controlElements() {
        return [
            iterationCountContainerElement,
            buttonsContainerElement,
            ruleDescriptionElement
        ];
    }
    // event handlers and their helper methods
    function advanceOneStepAndUpdateHtml() {
        logic.advanceOneStep();
        boardHtmlGenerator.updateBoardElement();
        updateIterationCount();
    }
    function start() {
        interval = setInterval(advanceOneStepAndUpdateHtml, 1000);
        isRunning = true;
        renderRunStopButtonAsStop();
    }
    function stop() {
        clearInterval(interval);
        isRunning = false;
        renderRunStopButtonAsRun();
    }
    function clear() {
        if (isRunning) {
            stop();
        }
        logic.clearLiveCells();
        boardHtmlGenerator.updateBoardElement();
    }
    function handleAdvanceAStepClick() {
        advanceOneStepAndUpdateHtml();
    }
    function handleAddRowClick() {
        boardHtmlGenerator.addRow();
        boardHtmlGenerator.updateBoardElement();
    }
    function handleAddColumnClick() {
        boardHtmlGenerator.addColumn();
        boardHtmlGenerator.updateBoardElement();
    }
    function handleClearClick() {
        clear();
    }
    function handleRunClick() {
        if (isRunning) {
            stop();
        }
        else {
            start();
        }
    }
    async function handleSaveClick() {
        const saveNameElement = document.getElementById('idSaveName');
        const saveName = saveNameElement.value;
        if (saveName) {
            const liveCells = logic.getLiveCells();
            const jsonString = JSON.stringify({
                name: saveName,
                liveCells: liveCells
            });
            //todo: add error checking to this fetch
            const response = await fetch(`/api/boards`, {
                method: "POST",
                body: jsonString,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
            const savedBoardsJson = await response.json();
            const savedBoards = savedBoardsJson.boards;
            const savedBoardsHtmlGenerator = SavedBoardsHtmlGenerator();
            savedBoardsHtmlGenerator.getSavedBoardsElement(savedBoards);
            //todo: update the list of saved boards here
        }
        else {
            alert('please enter a save name');
        }
    }
    const rc = {
        controlElements
    };
    return rc;
}
