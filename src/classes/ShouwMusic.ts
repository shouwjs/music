import { Player, type GuildQueueEvent, type ExtractorExecutionContext } from 'discord-player';
import { DefaultExtractors } from '@discord-player/extractor';
import { Commands } from './Commands';
import { Log } from 'youtubei.js';
import { YoutubeiExtractor } from 'discord-player-youtubei';
import type { CommandData, ManagerOptions } from '../typings';
import type { ShouwClient } from 'shouw.js';
Log.setLevel(Log.Level.NONE);

export class ShouwMusic {
    #player?: Player;
    #client?: ShouwClient;
    #cmd?: Commands;
    #options: ManagerOptions;

    public constructor(options: ManagerOptions = {}) {
        this.#options = options;
    }

    public initialize(client: ShouwClient): ShouwMusic {
        this.#player = new Player(client, this.options);
        this.#client = client;
        this.#client.music = this;
        this.#cmd = new Commands(this, this.options.events);
        this.loadMulti(DefaultExtractors);
        this.register(YoutubeiExtractor, this.options?.youtube ?? {});
        return this;
    }

    public command(data: CommandData): ShouwMusic {
        this.cmd?.add(data);
        return this;
    }

    public register(extractor: any, options: any): ShouwMusic {
        this.extractors?.register(extractor, options);
        return this;
    }

    public loadMulti(extractors: any[]): ShouwMusic {
        this.extractors?.loadMulti(extractors);
        return this;
    }

    public get cmd(): Commands | undefined {
        return this.#cmd;
    }

    public get options(): ManagerOptions {
        return this.#options;
    }

    public get connectOptions(): ManagerOptions['connectOptions'] {
        return this.options.connectOptions;
    }

    public get events(): GuildQueueEvent[] | string[] {
        return this.cmd?.events ?? [];
    }

    public get extractors(): ExtractorExecutionContext | undefined {
        return this.player?.extractors;
    }

    public get player(): Player | undefined {
        return this.#player;
    }

    public get client(): ShouwClient | undefined {
        return this.#client;
    }
}
