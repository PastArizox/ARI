import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    Colors,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { readdirSync } from 'fs';
import { join } from 'path';
import { category } from '../../config.json';

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
            const categoryParam = interaction.options.get('category')
                ?.value as string;

            if (
                categoryParam &&
                !commandsCategorie
                    .toLowerCase()
                    .includes(categoryParam.toLowerCase())
            )
                return;

            const commandsCategoriePath = join(
                commandsDir,
                '/',
                commandsCategorie
            );

            // Get the colors from config.json using category as any so it works
            // Can be undefined if the category isn't defined in config.json
            let categoryColor = (category as any)[commandsCategorie];

            embedDescription += `\n${
                categoryColor ? categoryColor : ''
            } **${commandsCategorie
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
            .setDescription(embedDescription)
            .setColor(Colors.Blurple);

        await interaction.reply({ embeds: [embed] });
    },
};
