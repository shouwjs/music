"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shouw_js_1 = require("shouw.js");
const discord_player_1 = require("discord-player");
const discord_js_1 = require("discord.js");
class PlayTrack extends shouw_js_1.Functions {
    constructor() {
        super({
            name: '$playTrack',
            description: 'Plays a track from a given url or search query.',
            brackets: true,
            params: [
                {
                    name: 'query',
                    description: 'The query to search for.',
                    type: shouw_js_1.ParamType.String,
                    required: true
                },
                {
                    name: 'engine',
                    description: 'The engine to use to search for.',
                    type: shouw_js_1.ParamType.String,
                    required: false
                },
                {
                    name: 'channel',
                    description: 'The channel to play music.',
                    type: shouw_js_1.ParamType.String,
                    required: false
                }
            ]
        });
    }
    async code(ctx, [query, engine = void 0, channel = void 0]) {
        const voiceChannel = channel
            ? (ctx.client.channels.cache.get(channel) ?? (await ctx.client.channels.fetch(channel).catch(() => null)))
            : ctx.member?.voice?.channel;
        if (!voiceChannel)
            return await ctx.error('Invalid voice channel ID provided.', this.name);
        if (voiceChannel.type !== discord_js_1.ChannelType.GuildVoice && voiceChannel.type !== discord_js_1.ChannelType.GuildStageVoice)
            return await ctx.error(`Invalid channel type: ${discord_js_1.ChannelType[voiceChannel.type]}, must be a voice or stage channel.`, this.name);
        if (!query || query === '')
            return await ctx.error('Pleade provide a valid song title or URL', this.name);
        const player = (0, discord_player_1.useMainPlayer)();
        const connectOptions = ctx.client.music.connectOptions ?? {};
        const connectionOptionsUnion = {
            metadata: { text: ctx.channel },
            ...connectOptions
        };
        try {
            await player.play(voiceChannel, query?.unescape(), {
                nodeOptions: connectionOptionsUnion,
                searchEngine: engine,
                requestedBy: ctx.user
            });
        }
        catch (e) {
            return await ctx.error(`Failed to play track with reason: ${e.message}`, this.name);
        }
        return this.success();
    }
}
exports.default = PlayTrack;
