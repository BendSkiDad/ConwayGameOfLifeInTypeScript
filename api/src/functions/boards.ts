import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

let boards = [
    {
        id: 1,
        name: 'simple repeater',
        liveCells: [
            { rowIndex: 2, columnIndex: 15 },
            { rowIndex: 3, columnIndex: 15 },
            { rowIndex: 4, columnIndex: 15 },
        ]
    },
    {
        id: 2,
        name: 'diagnol gliders',
        liveCells: [
            { rowIndex: 2, columnIndex: 2 },
            { rowIndex: 2, columnIndex: 3 },
            { rowIndex: 2, columnIndex: 4 },
            { rowIndex: 3, columnIndex: 2 },
            { rowIndex: 4, columnIndex: 3 },

            { rowIndex: 7, columnIndex: 8 },
            { rowIndex: 8, columnIndex: 9 },
            { rowIndex: 9, columnIndex: 7 },
            { rowIndex: 9, columnIndex: 8 },
            { rowIndex: 9, columnIndex: 9 },
        ]
    },
]

interface ICell {
    rowIndex: number,
    columnIndex: number
}

interface ISavedBoard {
    id: number,
    name: string,
    liveCells: ICell[]
}

function instanceOfISavedBoard(object: any): object is ISavedBoard {
    if(object.name !== undefined && object.liveCells !== undefined) {
        return true
    }
    return false
}

export async function getBoards(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    let returnStatus: number = 200
    switch(request.method) {
        case "GET":
            break;
        case "POST": 
            const possibleSavedBoardObject = await request.json()
            if(instanceOfISavedBoard(possibleSavedBoardObject)) {
                possibleSavedBoardObject.id = Math.max(...boards.map((b) => b.id)) + 1
                boards.push(possibleSavedBoardObject)
                returnStatus = 201
            } else {
                returnStatus = 400
            }
            break
        case "DELETE":
            returnStatus = 405
    }
    return {
        status: returnStatus,
        jsonBody: {
            boards: boards.sort((a, b) => a.id < b.id ? 1 : -1)
        }
    }
};

app.http('boards', {
    methods: ['GET', 'POST', 'DELETE'],
    authLevel: 'anonymous',
    handler: getBoards
});
