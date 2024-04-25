import * as logic from "./logicTwoDimensional.js"
import { BoardHtmlGenerator } from "./boardHtmlGenerator.js"

export class ControlHtmlGenerator {
    //private iterationCountElementId: string = 'iterationCount'
    private runButton: HTMLInputElement = this.deriveButton('Run', this.handleRunClick)
    private iterationCountElement: HTMLSpanElement = document.createElement('span')
    private interval: number = 0
    private isRunning: boolean = false
    private boardHtmlGenerator: BoardHtmlGenerator

    constructor(boardHtmlGenerator_: BoardHtmlGenerator) {
        this.boardHtmlGenerator = boardHtmlGenerator_
    }
    private renderRunStopButtonAsRun (): void {
        //const runButton: HTMLElement = document.getElementById('btnRun') as HTMLButtonElement
        this.runButton.value = 'Run'
    }
  
    private renderRunStopButtonAsStop (): void {
      //const runButton = document.getElementById('btnRun')
      this.runButton.value = 'Stop'
    }
  
    private updateIterationCount (): void {
    //   const iterationCountDiv =
    //         document.getElementById(this.iterationCountElementId)
      this.iterationCountElement.textContent = logic.getIterationCount().toString()
    }
  
    private deriveRuleDescriptionElement (): HTMLParagraphElement {
      const rule: logic.BornAndSurviveRule = logic.getBornAndSuviveRule()
      const ruleText = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('')
      const textNode = document.createTextNode(ruleText)
      const pElement = document.createElement('p')
      pElement.appendChild(textNode)
      return pElement
    }
  
    private deriveIterationCountParagraph (iterationCount: number): HTMLParagraphElement {
      const labelTextNode = document.createTextNode('Iteration Count:')
      //const iterationCountElement = document.createElement('span')
      //iterationCountElement.setAttribute('id', this.iterationCountElementId)
      const countTextNode = document.createTextNode(iterationCount.toString())
      this.iterationCountElement.appendChild(countTextNode)
      const pElement = document.createElement('p')
      pElement.appendChild(labelTextNode)
      pElement.appendChild(this.iterationCountElement)
      return pElement
    }
  
    private deriveButton (value: string, fnClickHandler?: EventListenerOrEventListenerObject): HTMLInputElement {
      const button: HTMLInputElement = document.createElement('input')
      button.setAttribute('type', 'button')
      button.setAttribute('value', value)
      if(fnClickHandler) {
          button.addEventListener('click', fnClickHandler)
      }
      button.classList.add('button')
      return button
    }

    private deriveButtonsContainerElement (): HTMLElement {
      const advanceOneStepButton: HTMLInputElement =
        this.deriveButton('Advance a step', this.handleAdvanceAStepClick)
      const addRowButton: HTMLInputElement = this.deriveButton('Add Row', this.handleAddRowClick)
      const addColumnButton: HTMLInputElement = this.deriveButton('Add Column', this.handleAddColumnClick)
      const resetButton: HTMLInputElement = this.deriveButton('Clear', this.handleClearClick)
      //const runButton = this.deriveButton('Run', this.handleRunClick)
      //runButton.setAttribute('id', 'btnRun')
  
      const buttonContainerElement: HTMLDivElement = document.createElement('div')
      buttonContainerElement.appendChild(advanceOneStepButton)
      buttonContainerElement.appendChild(addRowButton)
      buttonContainerElement.appendChild(addColumnButton)
      buttonContainerElement.appendChild(resetButton)
      buttonContainerElement.appendChild(this.runButton)
  
      return buttonContainerElement
    }
  
    public controlElements (iterationCount: number): HTMLElement[] {
      const ruleDescriptionElement: HTMLElement =
            this.deriveRuleDescriptionElement()
      const iterationCountParagraphElement: HTMLElement =
            this.deriveIterationCountParagraph(iterationCount)
  
      const buttonsContainerElement: HTMLElement = this.deriveButtonsContainerElement()
  
      return [
        iterationCountParagraphElement,
        buttonsContainerElement,
        ruleDescriptionElement]
    }
  
    // event handlers and their helper methods
    private advanceOneStepAndUpdateHtml (): void {
      logic.advanceOneStep()
      this.boardHtmlGenerator.updateBoardElement()
      this.updateIterationCount()
    }
  
    private start (): void {
      this.interval = setInterval(this.advanceOneStepAndUpdateHtml, 1000)
      this.isRunning = true
      this.renderRunStopButtonAsStop()
    }
  
    private stop (): void {
      clearInterval(this.interval)
      this.isRunning = false
      this.renderRunStopButtonAsRun()
    }
  
    private clear (): void {
      if (this.isRunning) {
        this.stop()
      }
      logic.clearLiveCells()
      this.boardHtmlGenerator.updateBoardElement()
    }
  
    private handleAdvanceAStepClick (): void {
        this.advanceOneStepAndUpdateHtml()
    }
  
    private handleAddRowClick (): void {
      this.boardHtmlGenerator.addRow()
      this.boardHtmlGenerator.updateBoardElement()
    }
  
    private handleAddColumnClick (): void {
      this.boardHtmlGenerator.addColumn()
      this.boardHtmlGenerator.updateBoardElement()
    }
  
    private handleClearClick (): void {
      this.clear()
    }
  
    private handleRunClick (): void {
      if (this.isRunning) {
        stop()
      } else {
        this.start()
      }
    }
}