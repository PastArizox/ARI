import { CommandInteraction, CacheType, SlashCommandBuilder, Colors } from 'discord.js';
import { SlashCommand } from '../../types';
import { readdirSync } from 'fs';
import { join } from 'path';
import { category } from '../../config.json';
import { EmbedBuilder, ToAPIApplicationCommandOptions } from '@discordjs/builders';

export const command: SlashCommand = {
    name: 'help',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Show all available commands')
        .addStringOption((option) =>
            option
                .setName('command')
                .setDescription('The command you want to get help for')
                .setRequired(false)
        )
        .setDMPermission(true),

    async execute(interaction: CommandInteraction<CacheType>) {
        const commandParam = interaction.options.get('command')?.value as string;

        const embed = new EmbedBuilder().setColor(Colors.Blurple);
        let embedDescription = '';

        const commandsDir = join(__dirname, '../../commands');

        for (const commandsCategory of readdirSync(commandsDir)) {
            const commandsCategoryPath = join(commandsDir, commandsCategory);
            const categoryColor = (category as any)[commandsCategory] || '';

            embedDescription += `\n${categoryColor} **# ${commandsCategory.toUpperCase()} [${readdirSync(commandsCategoryPath).length}]**\n\n`;

            for (const commandFile of readdirSync(commandsCategoryPath)) {
                if (!commandFile.endsWith('ts') && !commandFile.endsWith('js')) continue;

                const commandPath = join(commandsCategoryPath, commandFile);
                const command: SlashCommand = require(commandPath).command;

                embedDescription += `\`${command.name}\` ; `;
            }

            embedDescription = embedDescription.slice(0, -3); // Remove last ' ; '
            embedDescription += '\n';
        }

        if (!commandParam) {
            embed.setTitle('Commands').setDescription(embedDescription);
        } else {
            let commandExists = false;

            for (const commandsCategory of readdirSync(commandsDir)) {
                const commandsCategoryPath = join(commandsDir, commandsCategory);

                for (const commandFile of readdirSync(commandsCategoryPath)) {
                    if (!commandFile.endsWith('ts') && !commandFile.endsWith('js')) continue;

                    if (
                        commandFile === `${commandParam}.js` ||
                        commandFile === `${commandParam}.ts`
                    ) {
                        commandExists = true;

                        const commandPath = join(commandsCategoryPath, commandFile);
                        const command: SlashCommand = require(commandPath).command;

                        const commandUsage = `/${command.name} ${command.data.options.map(option => optionToUsage(option)).join(' ')}`;
                        const commandOptions = command.data.options.map(option => `${optionToUsage(option)} : ${option.toJSON().description}`).join('\n');

                        embed.setTitle(`Detailed information about : \`${command.name}\``)
                            .addFields(
                                { name: 'Command', value: `\`${command.name}\`` },
                                { name: 'Description', value: `\`${command.data.description}\`` },
                                { name: 'Usage', value: `\`${commandUsage}\`` },
                                { name: 'Options', value: `\`${commandOptions || 'None'}\`` }
                            )
                            .setFooter({
                                text: 'Syntax: <> = required, [] = optional',
                            });
                        
                        break;
                    }
                }
                
                if (commandExists) {
                    break;
                }
            }

            if (!commandExists) {
                embed.setDescription(`The command **${commandParam}** doesn't exist`).setColor(Colors.Blurple);
            }
        }

        await interaction.reply({ embeds: [embed] });
    },
};

function optionToUsage(option: ToAPIApplicationCommandOptions): string {
    return option.toJSON().required ? `<${option.toJSON().name}>` : `[${option.toJSON().name}]`;
}
