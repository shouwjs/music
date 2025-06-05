"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ShouwMusic_player, _ShouwMusic_client, _ShouwMusic_cmd, _ShouwMusic_options;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShouwMusic = void 0;
const discord_player_1 = require("discord-player");
const extractor_1 = require("@discord-player/extractor");
const Commands_1 = require("./Commands");
const youtubei_js_1 = require("youtubei.js");
const discord_player_youtubei_1 = require("discord-player-youtubei");
youtubei_js_1.Log.setLevel(youtubei_js_1.Log.Level.NONE);
class ShouwMusic {
    constructor(options = {}) {
        _ShouwMusic_player.set(this, void 0);
        _ShouwMusic_client.set(this, void 0);
        _ShouwMusic_cmd.set(this, void 0);
        _ShouwMusic_options.set(this, void 0);
        __classPrivateFieldSet(this, _ShouwMusic_options, options, "f");
    }
    initialize(client) {
        __classPrivateFieldSet(this, _ShouwMusic_player, new discord_player_1.Player(client, this.options), "f");
        __classPrivateFieldSet(this, _ShouwMusic_client, client, "f");
        __classPrivateFieldGet(this, _ShouwMusic_client, "f").music = this;
        __classPrivateFieldSet(this, _ShouwMusic_cmd, new Commands_1.Commands(this, this.options.events), "f");
        this.loadMulti(extractor_1.DefaultExtractors);
        this.register(discord_player_youtubei_1.YoutubeiExtractor, this.options?.youtube ?? {});
        return this;
    }
    command(data) {
        this.cmd?.add(data);
        return this;
    }
    register(extractor, options) {
        this.extractors?.register(extractor, options);
        return this;
    }
    loadMulti(extractors) {
        this.extractors?.loadMulti(extractors);
        return this;
    }
    get cmd() {
        return __classPrivateFieldGet(this, _ShouwMusic_cmd, "f");
    }
    get options() {
        return __classPrivateFieldGet(this, _ShouwMusic_options, "f");
    }
    get connectOptions() {
        return this.options.connectOptions;
    }
    get events() {
        return this.cmd?.events ?? [];
    }
    get extractors() {
        return this.player?.extractors;
    }
    get player() {
        return __classPrivateFieldGet(this, _ShouwMusic_player, "f");
    }
    get client() {
        return __classPrivateFieldGet(this, _ShouwMusic_client, "f");
    }
}
exports.ShouwMusic = ShouwMusic;
_ShouwMusic_player = new WeakMap(), _ShouwMusic_client = new WeakMap(), _ShouwMusic_cmd = new WeakMap(), _ShouwMusic_options = new WeakMap();
