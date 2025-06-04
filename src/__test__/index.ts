// importing the modules
import { ShouwClient } from 'shouw.js';
import { Manager, Events } from '..';

// initialize the music manager
const music = new Manager({
    events: [Events.PlayerStart]
});

// initialize the client instance
const client = new ShouwClient({
    token: process.env.TOKEN,
    prefix: '*',
    debug: true,
    extensions: [music],
    intents: ['Guilds', 'GuildMessages', 'GuildVoiceStates', 'GuildMembers', 'MessageContent'],
    events: ['messageCreate']
});

// trackStart event
music.command({
    type: Events.PlayerStart,
    channel: '$channelId',
    code: 'Started playing at <#$voiceId>'
});

// play command
client.command({
    name: 'play',
    type: 'messageCreate',
    code: '$playTrack[$message;youtube]'
});
