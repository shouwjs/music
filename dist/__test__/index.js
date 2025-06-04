"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// importing the modules
const shouw_js_1 = require("shouw.js");
const __1 = require("..");
// initialize the music manager
const music = new __1.Manager({
    events: [__1.Events.PlayerStart]
});
// initialize the client instance
const client = new shouw_js_1.ShouwClient({
    token: process.env.TOKEN,
    prefix: '*',
    debug: true,
    extensions: [music],
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['messageCreate']
});
music.command({
    type: __1.Events.PlayerStart,
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});
// play command
client.command({
    name: 'play',
    type: 'messageCreate',
    code: '$playTrack[$message;youtube]'
});
