import { CommandInteraction, CacheType, SlashCommandBuilder } from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { readdirSync } from 'fs';
import { join } from 'path';

export const command: SlashCommand = {
    name: 'help',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all the availaible commands')
        .addStringOption((option) =>
            option
                .setName('category')
                .setDescription('Category of the command(s)')
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let embedDescription = '';

        const commandsDir = join(__dirname, '../../commands');

        readdirSync(commandsDir).forEach((commandsCategorie) => {
            const commandsCategoriePath = join(
                commandsDir,
                '/',
                commandsCategorie
            );

            embedDescription += `\n**${commandsCategorie
                .charAt(0)
                .toUpperCase()}${commandsCategorie.slice(1)}**\n`;

            readdirSync(commandsCategoriePath).forEach((commandFile) => {
                if (!commandFile.endsWith('ts') && !commandFile.endsWith('js'))
                    return;

                const commandPath = join(
                    commandsCategoriePath,
                    '/',
                    commandFile
                );
                const command: SlashCommand = require(commandPath).command;

                embedDescription += `\`${command.name}\`: ${command.data.description}\n`;
            });
        });

        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setDescription(embedDescription);

        await interaction.reply({ embeds: [embed] });
    },
};
