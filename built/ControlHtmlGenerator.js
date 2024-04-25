import * as logic from "./logicTwoDimensional.js";
export class ControlHtmlGenerator {
    constructor(boardHtmlGenerator_) {
        //private iterationCountElementId: string = 'iterationCount'
        this.runButton = this.deriveButton('Run', this.handleRunClick);
        this.iterationCountElement = document.createElement('span');
        this.interval = 0;
        this.isRunning = false;
        this.boardHtmlGenerator = boardHtmlGenerator_;
    }
    renderRunStopButtonAsRun() {
        //const runButton: HTMLElement = document.getElementById('btnRun') as HTMLButtonElement
        this.runButton.value = 'Run';
    }
    renderRunStopButtonAsStop() {
        //const runButton = document.getElementById('btnRun')
        this.runButton.value = 'Stop';
    }
    updateIterationCount() {
        //   const iterationCountDiv =
        //         document.getElementById(this.iterationCountElementId)
        this.iterationCountElement.textContent = logic.getIterationCount().toString();
    }
    deriveRuleDescriptionElement() {
        const rule = logic.getBornAndSuviveRule();
        const ruleText = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('');
        const textNode = document.createTextNode(ruleText);
        const pElement = document.createElement('p');
        pElement.appendChild(textNode);
        return pElement;
    }
    deriveIterationCountParagraph(iterationCount) {
        const labelTextNode = document.createTextNode('Iteration Count:');
        //const iterationCountElement = document.createElement('span')
        //iterationCountElement.setAttribute('id', this.iterationCountElementId)
        const countTextNode = document.createTextNode(iterationCount.toString());
        this.iterationCountElement.appendChild(countTextNode);
        const pElement = document.createElement('p');
        pElement.appendChild(labelTextNode);
        pElement.appendChild(this.iterationCountElement);
        return pElement;
    }
    deriveButton(value, fnClickHandler) {
        const button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('value', value);
        if (fnClickHandler) {
            button.addEventListener('click', fnClickHandler);
        }
        button.classList.add('button');
        return button;
    }
    deriveButtonsContainerElement() {
        const advanceOneStepButton = this.deriveButton('Advance a step', this.handleAdvanceAStepClick);
        const addRowButton = this.deriveButton('Add Row', this.handleAddRowClick);
        const addColumnButton = this.deriveButton('Add Column', this.handleAddColumnClick);
        const resetButton = this.deriveButton('Clear', this.handleClearClick);
        //const runButton = this.deriveButton('Run', this.handleRunClick)
        //runButton.setAttribute('id', 'btnRun')
        const buttonContainerElement = document.createElement('div');
        buttonContainerElement.appendChild(advanceOneStepButton);
        buttonContainerElement.appendChild(addRowButton);
        buttonContainerElement.appendChild(addColumnButton);
        buttonContainerElement.appendChild(resetButton);
        buttonContainerElement.appendChild(this.runButton);
        return buttonContainerElement;
    }
    controlElements(iterationCount) {
        const ruleDescriptionElement = this.deriveRuleDescriptionElement();
        const iterationCountParagraphElement = this.deriveIterationCountParagraph(iterationCount);
        const buttonsContainerElement = this.deriveButtonsContainerElement();
        return [
            iterationCountParagraphElement,
            buttonsContainerElement,
            ruleDescriptionElement
        ];
    }
    // event handlers and their helper methods
    advanceOneStepAndUpdateHtml() {
        logic.advanceOneStep();
        this.boardHtmlGenerator.updateBoardElement();
        this.updateIterationCount();
    }
    start() {
        this.interval = setInterval(this.advanceOneStepAndUpdateHtml, 1000);
        this.isRunning = true;
        this.renderRunStopButtonAsStop();
    }
    stop() {
        clearInterval(this.interval);
        this.isRunning = false;
        this.renderRunStopButtonAsRun();
    }
    clear() {
        if (this.isRunning) {
            this.stop();
        }
        logic.clearLiveCells();
        this.boardHtmlGenerator.updateBoardElement();
    }
    handleAdvanceAStepClick() {
        this.advanceOneStepAndUpdateHtml();
    }
    handleAddRowClick() {
        this.boardHtmlGenerator.addRow();
        this.boardHtmlGenerator.updateBoardElement();
    }
    handleAddColumnClick() {
        this.boardHtmlGenerator.addColumn();
        this.boardHtmlGenerator.updateBoardElement();
    }
    handleClearClick() {
        this.clear();
    }
    handleRunClick() {
        if (this.isRunning) {
            stop();
        }
        else {
            this.start();
        }
    }
}
