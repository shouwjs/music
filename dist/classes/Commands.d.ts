import { type ShouwClient } from 'shouw.js';
import type { ShouwMusic } from './ShouwMusic';
import { GuildQueueEvent } from 'discord-player';
import type { CommandData } from '../typings';
export declare class Commands {
    #private;
    [key: string]: any;
    readonly manager: ShouwMusic;
    readonly client: ShouwClient | undefined;
    readonly events: string[];
    constructor(manager: ShouwMusic, events: string[] | GuildQueueEvent[] | undefined);
    add(data: CommandData): Commands;
}
