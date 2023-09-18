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
import { Logger, LogLevel } from '../../utils/logger';

// TODO add permissions check

export const command: SlashCommand = {
    name: 'banid',
    data: new SlashCommandBuilder()
        .setName('banid')
        .setDescription('Ban a user from the server by its id')
        .addStringOption((option) =>
            option
                .setName('userid')
                .setDescription('The id of the user you want to ban')
                .setMinLength(18)
                .setMaxLength(19)
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
        let userId = interaction.options.get('userid')?.value as string;

        let reason =
            (interaction.options.get('reason')?.value as string) || 'Unknown';

        let nbDays = (interaction.options.get('days')?.value as number) || 7;

        let description: string;
        let passed = false;
        let member = null;

        try {
            let tempMember = interaction.guild?.members.fetch(userId);
            member = (await tempMember) as GuildMember;
        } catch {}

        if (userId == interaction.member?.user.id) {
            description = "❌ You can't ban yourself !";
        } else if (member && !member.bannable) {
            description = "❌ You can't ban this user !";
        } else {
            if (member) {
                member.ban({
                    deleteMessageSeconds: nbDays * 86400, // Number of seconds in 1 day
                    reason: reason,
                });
                description = `⛔ **${member.user.username}** has been banned from the server !`;
            } else {
                interaction.guild?.members.ban(userId, {
                    deleteMessageSeconds: nbDays * 86400, // Number of seconds in 1 day
                    reason: reason,
                });
                description = `⛔ **${userId}** has been banned from the server !`;
            }
            passed = true;
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
                        value: member ? `${member} | ${member.id}` : userId,
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
