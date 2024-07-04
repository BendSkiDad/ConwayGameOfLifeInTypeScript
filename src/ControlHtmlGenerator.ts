import * as logic from "./logicTwoDimensional.js"
import { IBoardHtmlGenerator } from "./boardHtmlGenerator.js"
import { ISavedBoard, SavedBoardsHtmlGenerator, ISavedBoardsHtmlGenerator } from "./savedBoardsHtmlGenerator.js"

export interface IControlHtmlGenerator {
    controlElements: Function
}

export function ControlHtmlGenerator (boardHtmlGenerator: IBoardHtmlGenerator, startingIterationCount: number) : IControlHtmlGenerator {
    const runButtonElement: HTMLInputElement = deriveButton('Run', handleRunClick)
    const iterationCountElement: HTMLSpanElement = document.createElement('span')
    let interval: number = 0
    let isRunning: boolean = false

    function renderRunStopButtonAsRun (): void {
        runButtonElement.value = 'Run'
    }
  
    function renderRunStopButtonAsStop (): void {
        runButtonElement.value = 'Stop'
    }
  
    function updateIterationCount (): void {
        iterationCountElement.textContent = logic.getIterationCount().toString()
    }
  
    function deriveRuleDescriptionElement (): HTMLParagraphElement {
        const rule: logic.BornAndSurviveRule = logic.getBornAndSurviveRule()
        const ruleText: string = 'Rule: B' + rule.arrBornNeighborCounts.join('') + '/S' + rule.arrSurviveNeighborCounts.join('')
        const textNode: Text = document.createTextNode(ruleText)
        const pElement: HTMLParagraphElement = document.createElement('p')
        pElement.appendChild(textNode)
        return pElement
    }
  
    function deriveIterationCountParagraph (iterationCount: number): HTMLParagraphElement {
        const labelTextNode: Text = document.createTextNode('Iteration Count:')
        const countTextNode: Text = document.createTextNode(iterationCount.toString())
        iterationCountElement.appendChild(countTextNode)
        const pElement: HTMLParagraphElement = document.createElement('p')
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
        buttonContainerElement.appendChild(runButtonElement)

        const textBoxElement : HTMLInputElement =
            document.createElement('input')
        textBoxElement.setAttribute('type', 'text')
        textBoxElement.setAttribute('id', 'idSaveName')
        const saveButton: HTMLInputElement =
            deriveButton('Save', handleSaveClick)
        buttonContainerElement.appendChild(textBoxElement)
        buttonContainerElement.appendChild(saveButton)

        return buttonContainerElement
    }

    function controlElements (): HTMLElement[] {
        const ruleDescriptionElement: HTMLElement =
            deriveRuleDescriptionElement()
        const iterationCountParagraphElement: HTMLElement =
            deriveIterationCountParagraph(startingIterationCount)
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

    async function handleSaveClick (): Promise<void> {
        const saveNameElement: HTMLInputElement = document.getElementById('idSaveName') as HTMLInputElement
        const saveName : string = saveNameElement.value
        if (saveName) {
            const liveCells = logic.getLiveCells()
            const jsonString: string = JSON.stringify( {
                name: saveName,
                liveCells: liveCells
            })

            //todo: add error checking to this fetch
            const response: Response = await fetch(
                `/api/boards`,
            {
                method: "POST",
                body: jsonString,
                headers: { 
                    "Content-type": "application/json; charset=UTF-8"
                } 
            })
            const savedBoardsJson = await response.json()
            const savedBoards: ISavedBoard[] = savedBoardsJson.boards
            
            const savedBoardsHtmlGenerator: ISavedBoardsHtmlGenerator = SavedBoardsHtmlGenerator()
            savedBoardsHtmlGenerator.getSavedBoardsElement(savedBoards)

            //todo: update the list of saved boards here
        } else {
            alert('please enter a save name')
        }
    }

    const rc: IControlHtmlGenerator = {
        controlElements
    }

    return rc
}