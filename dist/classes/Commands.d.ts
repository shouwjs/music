import { type ShouwClient } from 'shouw.js';
import type { Manager } from './Manager';
import { GuildQueueEvent } from 'discord-player';
import type { CommandData } from '../typings';
export declare class Commands {
    #private;
    [key: string]: any;
    readonly manager: Manager;
    readonly client: ShouwClient | undefined;
    readonly events: string[];
    constructor(manager: Manager, events: string[] | GuildQueueEvent[] | undefined);
    add(data: CommandData): Commands;
}
