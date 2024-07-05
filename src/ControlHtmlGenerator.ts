import * as logic from "./logicTwoDimensional.js"
import { IBoardHtmlGenerator } from "./boardHtmlGenerator.js"
import { ISavedBoard, ISavedBoardsHtmlGenerator } from "./savedBoardsHtmlGenerator.js"
import * as HtmlHelpers from "./HtmlHelpers"

export interface IControlHtmlGenerator {
    iterationCountContainerElement: HTMLParagraphElement,
    advanceOneStepButtonElement: HTMLInputElement,
    addRowButtonElement: HTMLInputElement,
    addColumnButtonElement: HTMLInputElement,
    resetButtonElement: HTMLInputElement,
    runButtonElement: HTMLInputElement,
    saveContainerElement: HTMLParagraphElement,
    ruleDescriptionElement: HTMLParagraphElement
}

export function ControlHtmlGenerator (boardHtmlGenerator: IBoardHtmlGenerator, startingIterationCount: number, savedBoardsHtmlGenerator: ISavedBoardsHtmlGenerator) : IControlHtmlGenerator {
    const runButtonElement: HTMLInputElement =
        HtmlHelpers.deriveButton('Run', handleRunClick)
    const iterationCountElement: HTMLSpanElement =
        document.createElement('span')
    const ruleDescriptionElement: HTMLParagraphElement = deriveRuleDescriptionElement()
    const iterationCountContainerElement: HTMLParagraphElement =
        deriveIterationCountParagraph(startingIterationCount)
    const advanceOneStepButtonElement: HTMLInputElement =
        HtmlHelpers.deriveButton('Advance a step', handleAdvanceAStepClick)
    const addRowButtonElement: HTMLInputElement =
        HtmlHelpers.deriveButton('Add Row', handleAddRowClick)
    const addColumnButtonElement: HTMLInputElement =
        HtmlHelpers.deriveButton('Add Column', handleAddColumnClick)
    const resetButtonElement: HTMLInputElement =
        HtmlHelpers.deriveButton('Clear', handleClearClick)
    const saveContainerElement: HTMLParagraphElement =
        deriveSaveContainerElement()
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
  
    function deriveSaveContainerElement(): HTMLParagraphElement {
        const textInputElement : HTMLInputElement =
            document.createElement('input')
        textInputElement.setAttribute('type', 'text')
        textInputElement.setAttribute('id', 'idSaveName')
        const saveButtonElement: HTMLInputElement =
            HtmlHelpers.deriveButton('Save', handleSaveClick)
        const pElement: HTMLParagraphElement = document.createElement('p')
        pElement.appendChild(textInputElement)
        pElement.appendChild(saveButtonElement)
        return pElement
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
            
            savedBoardsHtmlGenerator.updateSavedBoardsList(savedBoards)
       } else {
            alert('please enter a save name')
        }
    }

    const rc: IControlHtmlGenerator = {
        iterationCountContainerElement,
        advanceOneStepButtonElement,
        addRowButtonElement,
        addColumnButtonElement,
        resetButtonElement,
        runButtonElement,
        saveContainerElement,
        ruleDescriptionElement
       }

    return rc
}