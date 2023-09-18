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
                .setName('command')
                .setDescription('The command you want to get help for')
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        const commandParam = interaction.options.get('command')
            ?.value as string;

        let embedDescription = '';
        const embed = new EmbedBuilder();

        const commandsDir = join(__dirname, '../../commands');

        // TODO : refactor cuz trash code

        if (!commandParam) {
            readdirSync(commandsDir).forEach((commandsCategory) => {
                const commandsCategoryPath = join(
                    commandsDir,
                    '/',
                    commandsCategory
                );

                // Get the colors from config.json using category as any so it works
                // Can be undefined if the category isn't defined in config.json
                let categoryColor = (category as any)[commandsCategory];

                embedDescription += `\n${
                    categoryColor ? categoryColor : ''
                } **# ${commandsCategory.toUpperCase()} [${
                    readdirSync(commandsCategoryPath).length
                }]**\n\n`;

                readdirSync(commandsCategoryPath).forEach((commandFile) => {
                    if (
                        !commandFile.endsWith('ts') &&
                        !commandFile.endsWith('js')
                    )
                        return;

                    const commandPath = join(
                        commandsCategoryPath,
                        '/',
                        commandFile
                    );
                    const command: SlashCommand = require(commandPath).command;

                    // embedDescription += `\`${command.name}\`: ${command.data.description}\n`;
                    embedDescription += `\`${command.name}\` ; `;
                });

                embedDescription = embedDescription.slice(0, -3); // Remove last ' ; '
                embedDescription += '\n';
            });

            embed
                .setTitle('Commands')
                .setDescription(embedDescription)
                .setColor(Colors.Blurple);
        } else {
            readdirSync(commandsDir).forEach((commandsCategory) => {
                const commandsCategoryPath = join(
                    commandsDir,
                    '/',
                    commandsCategory
                );

                readdirSync(commandsCategoryPath).forEach((commandFile) => {
                    if (
                        !commandFile.endsWith('ts') &&
                        !commandFile.endsWith('js')
                    )
                        return;

                    if (
                        commandFile != `${commandParam}.js` &&
                        commandFile != `${commandParam}.ts`
                    )
                        return;

                    const commandPath = join(
                        commandsCategoryPath,
                        '/',
                        commandFile
                    );
                    const command: SlashCommand = require(commandPath).command;

                    let commandUsage = `/${command.name}`;
                    let commandOptions = '';

                    command.data.options.forEach((option) => {
                        commandUsage += option.toJSON().required
                            ? ` <${option.toJSON().name}>`
                            : ` [${option.toJSON().name}]`;

                        commandOptions += `${
                            option.toJSON().required
                                ? `<${option.toJSON().name}>`
                                : `[${option.toJSON().name}]`
                        } : ${option.toJSON().description}\n`;
                    });

                    embed
                        .setTitle(
                            `Detailed informations about : \`${command.name}\``
                        )
                        .addFields(
                            { name: 'Command', value: `\`${command.name}\`` },
                            {
                                name: 'Description',
                                value: `\`${command.data.description}\``,
                            },
                            {
                                name: 'Usage',
                                value: `\`${commandUsage}\``,
                            },
                            {
                                name: 'Options',
                                value: `\`${
                                    commandOptions.length != 0
                                        ? commandOptions
                                        : 'None'
                                }\``,
                            }
                        )
                        .setColor(Colors.Blurple)
                        .setFooter({
                            text: 'Syntax: <> = required, [] = optional',
                        });
                });
            });
        }

        await interaction.reply({ embeds: [embed] });
    },
};
