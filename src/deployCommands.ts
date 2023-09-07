import { readdirSync } from 'fs';
import { join } from 'path';
import { SlashCommand } from './types';
import {
    REST,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
    Routes,
} from 'discord.js';
import { token, clientId } from './secrets.json';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
const commandsDir = join(__dirname, '/commands');

readdirSync(commandsDir).forEach((commandsCategorie) => {
    const commandsCategoriePath = join(commandsDir, '/', commandsCategorie);
    readdirSync(commandsCategoriePath).forEach((commandFile) => {
        if (!commandFile.endsWith('ts') && !commandFile.endsWith('js')) return;

        const commandPath = join(commandsCategoriePath, '/', commandFile);
        const command: SlashCommand = require(commandPath).command;

        commands.push(command.data.toJSON());
    });
});

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        );

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(Routes.applicationCommands(clientId), {
            body: commands,
        });

        console.log(
            `Successfully reloaded ${
                Object(data).length
            } application (/) commands.`
        );
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();
