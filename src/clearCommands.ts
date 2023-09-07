import { REST, Routes } from 'discord.js';
import { token, clientId } from './secrets.json';

const rest = new REST().setToken(token);

rest.put(Routes.applicationCommands(clientId), { body: [] })
    .then(() => console.log('Successfully deleted all application commands.'))
    .catch(console.error);
