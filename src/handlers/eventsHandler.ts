import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { EventType } from '../types';

const eventsDir = join(__dirname, '../events');

module.exports = (client: Client) => {
    readdirSync(eventsDir).forEach((file) => {
        if (!file.endsWith('.ts') && !file.endsWith('.js')) return;

        const filePath = join(eventsDir, '/', file);

        console.log(`[HANDLER] Loading ${file}`);
        const event: EventType = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    });
};
