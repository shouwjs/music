import { type Interpreter, type FunctionResultData, ParamType, Functions } from 'shouw.js';
import { useMainPlayer, type SearchQueryType } from 'discord-player';
import { type VoiceBasedChannel, ChannelType } from 'discord.js';

export default class PlayTrack extends Functions {
    constructor() {
        super({
            name: '$playTrack',
            description: 'Plays a track from a given url or search query.',
            brackets: true,
            params: [
                {
                    name: 'query',
                    description: 'The query to search for.',
                    type: ParamType.String,
                    required: true
                },
                {
                    name: 'engine',
                    description: 'The engine to use to search for.',
                    type: ParamType.String,
                    required: false
                },
                {
                    name: 'channel',
                    description: 'The channel to play music.',
                    type: ParamType.String,
                    required: false
                }
            ]
        });
    }

    async code(
        ctx: Interpreter,
        [query, engine = void 0, channel = void 0]: [string, string | undefined, string | undefined]
    ): Promise<FunctionResultData> {
        const voiceChannel = channel
            ? (ctx.client.channels.cache.get(channel) ?? (await ctx.client.channels.fetch(channel).catch(() => null)))
            : ctx.member?.voice?.channel;

        if (!voiceChannel) return await ctx.error('Invalid voice channel ID provided.', this.name);
        if (voiceChannel.type !== ChannelType.GuildVoice && voiceChannel.type !== ChannelType.GuildStageVoice)
            return await ctx.error(
                `Invalid channel type: ${ChannelType[voiceChannel.type]}, must be a voice or stage channel.`,
                this.name
            );

        if (!query || query === '') return await ctx.error('Pleade provide a valid song title or URL', this.name);

        const player = useMainPlayer();
        const connectOptions = ctx.client.music.connectOptions ?? {};
        const connectionOptionsUnion = {
            metadata: { text: ctx.channel },
            ...connectOptions
        };

        try {
            await player.play(<VoiceBasedChannel>voiceChannel, query?.unescape(), {
                nodeOptions: connectionOptionsUnion,
                searchEngine: engine as (SearchQueryType | `ext:${string}`) | undefined,
                requestedBy: ctx.user
            });
        } catch (e: any) {
            return await ctx.error(`Failed to play track with reason: ${e.message}`, this.name);
        }

        return this.success();
    }
}
