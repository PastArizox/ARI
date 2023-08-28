import { CacheType, CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';

export const command: SlashCommand = {
    name: 'ping',
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Print the ping of the bot'),
    async execute(interaction: CommandInteraction<CacheType>) {
        await interaction.reply(`Pong! \`${interaction.client.ws.ping} ms\``);
    },
};
