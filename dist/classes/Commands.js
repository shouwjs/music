"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Commands_instances, _Commands_bindEvents;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Commands = void 0;
const shouw_js_1 = require("shouw.js");
const node_path_1 = require("node:path");
const discord_player_1 = require("discord-player");
class Commands {
    constructor(manager, events) {
        _Commands_instances.add(this);
        this.events = [];
        this.manager = manager;
        this.client = manager.client;
        this.client?.functions.load((0, node_path_1.join)(__dirname, '..', 'functions'), this.client?.shouwOptions.debug ?? false);
        if (Array.isArray(events)) {
            this.events = events.filter((e) => {
                return Object.values(discord_player_1.GuildQueueEvent).includes(e);
            });
            if (this.events.length) {
                for (const event of this.events) {
                    if (this[event] instanceof shouw_js_1.Collective)
                        continue;
                    this[event] = new shouw_js_1.Collective();
                    __classPrivateFieldGet(this, _Commands_instances, "m", _Commands_bindEvents).call(this, event);
                }
            }
        }
    }
    add(data) {
        if (!data || typeof data !== 'object')
            return this;
        const command = this[data.type];
        if (!command || !Object.hasOwn(data, 'code'))
            return this;
        command.set(command.size, data);
        return this;
    }
}
exports.Commands = Commands;
_Commands_instances = new WeakSet(), _Commands_bindEvents = function _Commands_bindEvents(event) {
    const commands = this[event];
    if (!commands || !this.manager.player)
        return this;
    this.manager.player.events.on(event, async (queue, ...args) => {
        for (const cmd of commands.values()) {
            if (!cmd || !cmd.code)
                continue;
            let guild = queue.guild;
            const author = queue.currentTrack?.requestedBy ?? null;
            let channel = queue.metadata.text;
            const member = guild && author ? (guild.members.cache.get(author.id) ?? null) : null;
            if (cmd.channel.includes('$') && cmd.channel !== '$') {
                channel =
                    this.client?.channels.cache.get((await new shouw_js_1.Interpreter({
                        name: 'channel',
                        type: 'parsing',
                        code: cmd.channel
                    }, {
                        client: this.client,
                        channel: channel ?? void 0,
                        args: [],
                        guild,
                        user: author ?? void 0,
                        member: member ?? void 0,
                        Temporarily: { ...args }
                    }, {
                        sendMessage: false,
                        returnId: false,
                        returnResult: true,
                        returnError: false,
                        returnData: false
                    }).initialize())?.result) ?? null;
            }
            if (!channel)
                channel = queue.metadata.text;
            if (!guild)
                guild = queue.guild;
            await this.manager.player?.context.provide({ guild }, async () => {
                await new shouw_js_1.Interpreter(cmd, {
                    client: this.client,
                    channel: channel ?? void 0,
                    args: [],
                    guild,
                    user: author ?? void 0,
                    member: member ?? void 0,
                    Temporarily: { ...args }
                }, {
                    sendMessage: true,
                    returnId: false,
                    returnResult: false,
                    returnError: false,
                    returnData: false
                }).initialize();
            });
        }
    });
    return this;
};
