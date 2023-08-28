import { Client } from 'discord.js';
import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand } from '../types';

const commandsDir = join(__dirname, '../commands');

module.exports = (client: Client) => {
    readdirSync(commandsDir).forEach((commandsCategorie) => {
        const commandsCategoriePath = join(commandsDir, '/', commandsCategorie);
        readdirSync(commandsCategoriePath).forEach((commandFile) => {
            if (!commandFile.endsWith('ts') && !commandFile.endsWith('js'))
                return;

            const commandPath = join(commandsCategoriePath, '/', commandFile);
            console.log(`[HANDLER] Loading ${commandFile}`);
            const command: SlashCommand = require(commandPath).command;

            client.slashCommands.set(command.name, command);
        });
    });
};
