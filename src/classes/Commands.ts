import { type ShouwClient, type InteractionWithMessage, Context, Interpreter, Collective } from 'shouw.js';
import { join } from 'node:path';
import type { Manager } from './Manager';
import type { Channel, Guild, GuildMember, User } from 'discord.js';
import { type GuildQueue, GuildQueueEvent } from 'discord-player';
import type { CommandData } from '../typings';

export class Commands {
    [key: string]: any;
    public readonly manager: Manager;
    public readonly client: ShouwClient | undefined;
    public readonly events: string[] = [];

    constructor(manager: Manager, events: string[] | GuildQueueEvent[] | undefined) {
        this.manager = manager;
        this.client = manager.client;
        this.client?.functions.load(join(__dirname, '..', 'functions'), this.client?.shouwOptions.debug ?? false);

        if (Array.isArray(events)) {
            this.events = events.filter((e: string): boolean => {
                return (Object.values(GuildQueueEvent) as string[]).includes(e as string);
            }) as string[];

            if (this.events.length) {
                for (const event of this.events) {
                    if (this[event] instanceof Collective) continue;
                    this[event] = new Collective<number, CommandData>();
                    this.#bindEvents(event as GuildQueueEvent);
                }
            }
        }
    }

    #bindEvents(event: GuildQueueEvent): Commands {
        const commands = this[event];
        if (!commands || !this.manager.player) return this;

        this.manager.player.events.on(event, async (queue: GuildQueue<any>, ...args: any) => {
            for (const cmd of commands.values()) {
                if (!cmd || !cmd.code) continue;

                let guild: Guild = queue.guild;
                const author: User | null = queue.currentTrack?.requestedBy ?? null;
                let channel: Channel | null = queue.metadata.text;
                const member: GuildMember | null =
                    guild && author ? (guild.members.cache.get(author.id) ?? null) : null;

                if (cmd.channel.includes('$') && cmd.channel !== '$') {
                    channel =
                        this.client?.channels.cache.get(
                            (
                                await new Interpreter(
                                    {
                                        name: 'channel',
                                        type: 'parsing',
                                        code: cmd.channel
                                    },
                                    {
                                        context: new Context(
                                            {
                                                channel,
                                                guild,
                                                user: author,
                                                member
                                            } as InteractionWithMessage,
                                            []
                                        ),
                                        client: this.client as ShouwClient,
                                        channel: channel ?? void 0,
                                        args: [],
                                        guild,
                                        user: author ?? void 0,
                                        member: member ?? void 0,
                                        Temporarily: { ...args }
                                    },
                                    {
                                        sendMessage: false,
                                        returnId: false,
                                        returnResult: true,
                                        returnError: false,
                                        returnData: false
                                    }
                                ).initialize()
                            )?.result as string
                        ) ?? null;
                }

                if (!channel) channel = queue.metadata.text;
                if (!guild) guild = queue.guild;

                await this.manager.player?.context.provide({ guild }, async () => {
                    await new Interpreter(
                        cmd,
                        {
                            context: new Context(
                                {
                                    channel,
                                    guild,
                                    user: author,
                                    member
                                } as InteractionWithMessage,
                                []
                            ),
                            client: this.client as ShouwClient,
                            channel: channel ?? void 0,
                            args: [],
                            guild,
                            user: author ?? void 0,
                            member: member ?? void 0,
                            Temporarily: { ...args }
                        },
                        {
                            sendMessage: true,
                            returnId: false,
                            returnResult: false,
                            returnError: false,
                            returnData: false
                        }
                    ).initialize();
                });
            }
        });

        return this;
    }

    public add(data: CommandData): Commands {
        if (!data || typeof data !== 'object') return this;
        const command = this[data.type];
        if (!command || !Object.hasOwn(data, 'code')) return this;
        command.set(command.size, data);
        return this;
    }
}
