import * as logic from "./logicTwoDimensional.js";
export function ControlHtmlGenerator(boardHtmlGenerator) {
    //private iterationCountElementId: string = 'iterationCount'
    const runButton = deriveButton('Run', handleRunClick);
    const iterationCountElement = document.createElement('span');
    let interval = 0;
    let isRunning = false;
    function renderRunStopButtonAsRun() {
        //const runButton: HTMLElement = document.getElementById('btnRun') as HTMLButtonElement
        runButton.value = 'Run';
    }
    function renderRunStopButtonAsStop() {
        //const runButton = document.getElementById('btnRun')
        runButton.value = 'Stop';
    }
    function updateIterationCount() {
        //   const iterationCountDiv =
        //         document.getElementById(iterationCountElementId)
        iterationCountElement.textContent = logic.getIterationCount().toString();
    }
    function deriveRuleDescriptionElement() {
        const rule = logic.getBornAndSuviveRule();
        const ruleText = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('');
        const textNode = document.createTextNode(ruleText);
        const pElement = document.createElement('p');
        pElement.appendChild(textNode);
        return pElement;
    }
    function deriveIterationCountParagraph(iterationCount) {
        const labelTextNode = document.createTextNode('Iteration Count:');
        //const iterationCountElement = document.createElement('span')
        //iterationCountElement.setAttribute('id', iterationCountElementId)
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
        const advanceOneStepButton = deriveButton('Advance a step', handleAdvanceAStepClick);
        const addRowButton = deriveButton('Add Row', handleAddRowClick);
        const addColumnButton = deriveButton('Add Column', handleAddColumnClick);
        const resetButton = deriveButton('Clear', handleClearClick);
        //const runButton = deriveButton('Run', handleRunClick)
        //runButton.setAttribute('id', 'btnRun')
        const buttonContainerElement = document.createElement('div');
        buttonContainerElement.appendChild(advanceOneStepButton);
        buttonContainerElement.appendChild(addRowButton);
        buttonContainerElement.appendChild(addColumnButton);
        buttonContainerElement.appendChild(resetButton);
        buttonContainerElement.appendChild(runButton);
        return buttonContainerElement;
    }
    function controlElements(iterationCount) {
        const ruleDescriptionElement = deriveRuleDescriptionElement();
        const iterationCountParagraphElement = deriveIterationCountParagraph(iterationCount);
        const buttonsContainerElement = deriveButtonsContainerElement();
        return [
            iterationCountParagraphElement,
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
    return {
        controlElements
    };
}
