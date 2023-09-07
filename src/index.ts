import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { token } from './secrets.json';
import { join } from 'path';
import { readdirSync } from 'fs';
import { SlashCommand } from './types';

console.log('Bot is starting...');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
});

client.slashCommands = new Collection<string, SlashCommand>();

const handlerDir = join(__dirname, '/handlers');

readdirSync(handlerDir).forEach((handlerFile) => {
    const handlerPath = join(handlerDir, '/', handlerFile);
    console.log(`[MAIN] Loading ${handlerFile}`);
    require(handlerPath)(client);
});

client.login(token);
