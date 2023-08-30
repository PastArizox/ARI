import {
    CommandInteraction,
    CacheType,
    SlashCommandBuilder,
    GuildMember,
    Colors,
    Guild,
} from 'discord.js';
import { SlashCommand } from '../../types';
import { EmbedBuilder } from '@discordjs/builders';
import { LogLevel, Logger } from '../../utils/logger';

export const command: SlashCommand = {
    name: 'ban',
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a user from the server')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user you want to ban')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason why you want to ban the user')
                .setRequired(false)
        )
        .addIntegerOption((option) =>
            option
                .setName('days')
                .setDescription(
                    'Number of days of messages to delete, must be between 0 and 7, inclusive'
                )
                .setMinValue(0)
                .setMaxValue(7)
                .setRequired(false)
        ),
    async execute(interaction: CommandInteraction<CacheType>) {
        let member = interaction.options.get('user')?.member as GuildMember;
        if (!member) member = interaction.member as GuildMember;

        let reason = interaction.options.get('reason')?.value as string;
        if (!reason) reason = 'Unknown';

        let nbDays = interaction.options.get('days')?.value as number;
        if (!nbDays) nbDays = 7;

        let description: string;
        let passed = false;

        if (member == interaction.member) {
            description = "❌ You can't ban yourself !";
        } else if (!member.kickable) {
            description = "❌ You can't ban this user !";
        } else {
            member.ban({
                deleteMessageSeconds: nbDays * 86400, // Number of seconds in 1 day
                reason: reason,
            });
            passed = true;
            description = `⛔ **${member.user.username}** has been banned from the server !`;
        }

        const embed = new EmbedBuilder()
            .setTitle(description)
            .setColor(Colors.Red)
            .setImage(
                passed
                    ? 'https://media.tenor.com/4dTTTBzI-K0AAAAC/thor-hammer.gif'
                    : null
            );

        interaction.reply({ embeds: [embed] });

        if (passed) {
            Logger.log(
                interaction.guild as Guild,
                '⛔ User banned',
                interaction.user,
                reason,
                LogLevel.IMPORTANT,
                [
                    {
                        title: 'User banned',
                        value: `${member} | ${member.id}`,
                    },
                    {
                        title: 'Deleted messages',
                        value: `${nbDays} day(s)`,
                    },
                ]
            );
        }
    },
};
