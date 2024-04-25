import * as logic from "./logicTwoDimensional.js"
import { IBoardHtmlGenerator } from "./boardHtmlGenerator.js"

export function ControlHtmlGenerator (boardHtmlGenerator: IBoardHtmlGenerator) {
    const runButton: HTMLInputElement = deriveButton('Run', handleRunClick)
    const iterationCountElement: HTMLSpanElement = document.createElement('span')
    let interval: number = 0
    let isRunning: boolean = false

    function renderRunStopButtonAsRun (): void {
        runButton.value = 'Run'
    }
  
    function renderRunStopButtonAsStop (): void {
        runButton.value = 'Stop'
    }
  
    function updateIterationCount (): void {
        iterationCountElement.textContent = logic.getIterationCount().toString()
    }
  
    function deriveRuleDescriptionElement (): HTMLParagraphElement {
        const rule: logic.BornAndSurviveRule = logic.getBornAndSuviveRule()
        const ruleText = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('')
        const textNode = document.createTextNode(ruleText)
        const pElement = document.createElement('p')
        pElement.appendChild(textNode)
        return pElement
    }
  
    function deriveIterationCountParagraph (iterationCount: number): HTMLParagraphElement {
        const labelTextNode = document.createTextNode('Iteration Count:')
        const countTextNode = document.createTextNode(iterationCount.toString())
        iterationCountElement.appendChild(countTextNode)
        const pElement = document.createElement('p')
        pElement.appendChild(labelTextNode)
        pElement.appendChild(iterationCountElement)
        return pElement
    }
  
    function deriveButton (value: string, fnClickHandler?: EventListenerOrEventListenerObject): HTMLInputElement {
        const button: HTMLInputElement = document.createElement('input')
        button.setAttribute('type', 'button')
        button.setAttribute('value', value)
        if(fnClickHandler) {
            button.addEventListener('click', fnClickHandler)
        }
        button.classList.add('button')
        return button
    }

    function deriveButtonsContainerElement (): HTMLElement {
        const advanceOneStepButton: HTMLInputElement =
            deriveButton('Advance a step', handleAdvanceAStepClick)
        const addRowButton: HTMLInputElement =
            deriveButton('Add Row', handleAddRowClick)
        const addColumnButton: HTMLInputElement =
            deriveButton('Add Column', handleAddColumnClick)
        const resetButton: HTMLInputElement =
            deriveButton('Clear', handleClearClick)
        const buttonContainerElement: HTMLDivElement =
            document.createElement('div')
        buttonContainerElement.appendChild(advanceOneStepButton)
        buttonContainerElement.appendChild(addRowButton)
        buttonContainerElement.appendChild(addColumnButton)
        buttonContainerElement.appendChild(resetButton)
        buttonContainerElement.appendChild(runButton)
        return buttonContainerElement
    }
  
    function controlElements (iterationCount: number): HTMLElement[] {
        const ruleDescriptionElement: HTMLElement =
            deriveRuleDescriptionElement()
        const iterationCountParagraphElement: HTMLElement =
            deriveIterationCountParagraph(iterationCount)
        const buttonsContainerElement: HTMLElement =
            deriveButtonsContainerElement()
        return [
            iterationCountParagraphElement,
            buttonsContainerElement,
            ruleDescriptionElement]
    }
  
    // event handlers and their helper methods
    function advanceOneStepAndUpdateHtml (): void {
        logic.advanceOneStep()
        boardHtmlGenerator.updateBoardElement()
        updateIterationCount()
    }
  
    function start (): void {
        interval = setInterval(advanceOneStepAndUpdateHtml, 1000)
        isRunning = true
        renderRunStopButtonAsStop()
    }
  
    function stop (): void {
        clearInterval(interval)
        isRunning = false
        renderRunStopButtonAsRun()
    }
  
    function clear (): void {
        if (isRunning) {
            stop()
        }
        logic.clearLiveCells()
        boardHtmlGenerator.updateBoardElement()
    }
  
    function handleAdvanceAStepClick (): void {
        advanceOneStepAndUpdateHtml()
    }
  
    function handleAddRowClick (): void {
        boardHtmlGenerator.addRow()
        boardHtmlGenerator.updateBoardElement()
    }
  
    function handleAddColumnClick (): void {
        boardHtmlGenerator.addColumn()
        boardHtmlGenerator.updateBoardElement()
    }
  
    function handleClearClick (): void {
        clear()
    }
  
    function handleRunClick (): void {
        if (isRunning) {
            stop()
      } else {
            start()
      }
    }

    return {
        controlElements
    }
}