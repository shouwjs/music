import { type Interpreter, type FunctionResultData, Functions } from 'shouw.js';
export default class PlayTrack extends Functions {
    constructor();
    code(ctx: Interpreter, [query, engine, channel]: [string, string | undefined, string | undefined]): Promise<FunctionResultData>;
}
