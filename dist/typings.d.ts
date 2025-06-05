import type { GuildQueueEvent, GuildNodeCreateOptions, PlayerInitOptions } from 'discord-player';
import type { YoutubeiOptions } from 'discord-player-youtubei';
export interface CommandData {
    name?: string;
    type: string;
    code: string;
    [key: string | number | symbol | `${any}`]: any;
}
export interface ManagerOptions extends PlayerInitOptions {
    connectOptions?: Omit<GuildNodeCreateOptions<unknown>, 'metadata'>;
    events?: string[] | GuildQueueEvent[];
    youtube?: YoutubeiOptions;
}
