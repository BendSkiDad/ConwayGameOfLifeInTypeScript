import * as logic from "./logicTwoDimensional.js";
import * as HtmlHelpers from "./HtmlHelpers.js";
export function ControlHtmlGenerator(boardHtmlGenerator, startingIterationCount, savedBoardsHtmlGenerator) {
    const runButtonElement = HtmlHelpers.deriveButton('Run', handleRunClick);
    const iterationCountElement = document.createElement('span');
    const ruleDescriptionElement = deriveRuleDescriptionElement();
    const iterationCountContainerElement = deriveIterationCountParagraph(startingIterationCount);
    const advanceOneStepButtonElement = HtmlHelpers.deriveButton('Advance a step', handleAdvanceAStepClick);
    const addRowButtonElement = HtmlHelpers.deriveButton('Add Row', handleAddRowClick);
    const addColumnButtonElement = HtmlHelpers.deriveButton('Add Column', handleAddColumnClick);
    const resetButtonElement = HtmlHelpers.deriveButton('Clear', handleClearClick);
    const saveContainerElement = deriveSaveContainerElement();
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
    function deriveSaveContainerElement() {
        const textInputElement = document.createElement('input');
        textInputElement.setAttribute('type', 'text');
        textInputElement.setAttribute('id', 'idSaveName');
        const saveButtonElement = HtmlHelpers.deriveButton('Save', handleSaveClick);
        const pElement = document.createElement('p');
        pElement.appendChild(textInputElement);
        pElement.appendChild(saveButtonElement);
        return pElement;
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
        if (isRunning) {
            stop();
        }
        logic.clearLiveCells();
        boardHtmlGenerator.updateBoardElement();
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
            savedBoardsHtmlGenerator.updateSavedBoardsList(savedBoards);
        }
        else {
            alert('please enter a save name');
        }
    }
    const rc = {
        iterationCountContainerElement,
        advanceOneStepButtonElement,
        addRowButtonElement,
        addColumnButtonElement,
        resetButtonElement,
        runButtonElement,
        saveContainerElement,
        ruleDescriptionElement
    };
    return rc;
}
