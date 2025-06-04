import { Player, type GuildQueueEvent, type ExtractorExecutionContext } from 'discord-player';
import { Commands } from './Commands';
import type { CommandData, ManagerOptions } from '../typings';
import type { ShouwClient } from 'shouw.js';
export declare class Manager {
    #private;
    constructor(options?: ManagerOptions);
    initialize(client: ShouwClient): void;
    command(data: CommandData): Manager;
    register(extractor: any, options: any): Manager;
    loadMulti(extractors: any[]): Manager;
    get cmd(): Commands | undefined;
    get options(): ManagerOptions;
    get connectOptions(): ManagerOptions['connectOptions'];
    get events(): GuildQueueEvent[] | string[];
    get extractors(): ExtractorExecutionContext | undefined;
    get player(): Player | undefined;
    get client(): ShouwClient | undefined;
}
