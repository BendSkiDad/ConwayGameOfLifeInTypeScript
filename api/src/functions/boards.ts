import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

let boards = [
    {
        name: 'simple repeater',
        liveCells: [
            { rowIndex: 2, columnIndex: 15 },
            { rowIndex: 3, columnIndex: 15 },
            { rowIndex: 4, columnIndex: 15 },
        ]
    },
    {
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


export async function getBoards(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);
    return {
        jsonBody: {
            boards: boards
        }
    }
};

app.http('boards', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: getBoards
});
